import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormField, MatLabel, MatError, MatHint, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InterviewService } from '../../../services/interview.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { LoaderComponent } from "../loader/loader.component";

// Custom validator to check if passwords match
export function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { misMatch: true }
    : null;
}

@Component({
  selector: 'app-interviewer-onboard',
  templateUrl: './interviewer-onboard.component.html',
  styleUrls: ['./interviewer-onboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIcon,
    MatButtonModule,
    LoaderComponent
],
})
export class InterviewerOnboardComponent {
  onboardForm: FormGroup;
  isLoading: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
readonly dialog = inject(MatDialog);
  constructor(private fb: FormBuilder, private interviewService: InterviewService) {
    
    this.onboardForm = this.fb.group({
      // Personal Information
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      // Professional Details
      designation: [''],
      experience: [null, [Validators.min(0)]],
      skills: [[]],
      profileUrl: ['', [Validators.pattern('https?://.+')]],

      // Payment Information
      upi: [''],

      // Account Security
      security: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      }, { validators: passwordMatcher })
    });
  }



  // Getter for easy access to form controls in the template
  get f() { return this.onboardForm.controls; }
  get securityControls() { return (this.onboardForm.get('security') as FormGroup).controls; }

  // --- Skills Chip Input Logic ---
  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentSkills = this.f['skills'].value;
      this.f['skills'].setValue([...currentSkills, value]);
    }
    event.chipInput!.clear();
  }

  removeSkill(skill: string): void {
    const currentSkills = this.f['skills'].value;
    const index = currentSkills.indexOf(skill);
    if (index >= 0) {
      const newSkills = [...currentSkills];
      newSkills.splice(index, 1);
      this.f['skills'].setValue(newSkills);
    }
  }

  // --- Form Submission ---
  submitApplication(): void {
    this.onboardForm.markAllAsTouched();
    if (this.onboardForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    // Combine form data
    const formData = {
      ...this.onboardForm.value,
      password: this.onboardForm.value.security.password
    };
    delete formData.security;
    this.isLoading = true;
    this.interviewService.createInterviewer(formData).subscribe((res:any)=>{
      this.onboardForm.reset();
      this.isLoading = false;
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'success',
          body: 'We have received your details, person from our team will reach out to you!',
          type: 'success'
        }
      })
    }, error => {
      this.isLoading = false;
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'error',
          body: 'Something went wrong, please try again!',
          type: 'error'
        }
      })
    })
    
  }
}
