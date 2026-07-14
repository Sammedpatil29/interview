import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-schedule-interview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextFieldModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './schedule-interview.component.html',
  styleUrl: './schedule-interview.component.css'
})
export class ScheduleInterviewComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);

  personalDetailsForm!: FormGroup;
  skillsForm!: FormGroup;
  slotsForm!: FormGroup;

  minDate: any;
  maxDate: any;

  isHomePage: boolean = false;

  allSkills: string[] = ['Angular', 'React', 'Vue', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Java', 'Python', 'AWS', 'Docker'];
  filteredSkills!: Observable<string[]>;
  skillCtrl = new FormControl();

  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;

  get skills() {
    return this.skillsForm.get('skills') as FormControl;
  }

  ngOnInit() {
    this.isHomePage = this.router.url.includes('home') || this.router.url === '/';

    // Set the minimum date to today
    this.minDate = new Date();
    // Set the maximum date to one month from today
    const nextMonth = new Date();
    nextMonth.setMonth(this.minDate.getMonth() + 1);
    this.maxDate = nextMonth;

    this.personalDetailsForm = this._formBuilder.group({
      candidateName: ['', Validators.required],
      candidateEmail: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      experienceLevel: ['', Validators.required],
    });

    this.skillsForm = this._formBuilder.group({
      type: ['', Validators.required],
      skills: [[]],
      resume: [null]
    });

    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => (skill ? this._filter(skill) : this.allSkills.slice())),
    );

    this.slotsForm = this._formBuilder.group({
      slot1: this._formBuilder.group({
        date: [null, Validators.required],
        time: [null, Validators.required],
      }),
      slot2: this._formBuilder.group({
        date: [null],
        time: [null],
      }),
      slot3: this._formBuilder.group({
        date: [null],
        time: [null],
      }),
    });
  }

  scheduleInterview() {
    const personalDetails = this.personalDetailsForm.value;
    const skillsDetails = this.skillsForm.value;
    const slotsDetails = this.slotsForm.value;

    const payload = {
      ...personalDetails,
      ...skillsDetails,
      slots: slotsDetails
      // The other properties like schedule, hr, interviewer, payment, etc.
      // will likely be added by your backend service upon processing.
    };
    console.log('Scheduling interview with details:', payload);
    // Here you would typically call a service to save the interview details
  }

  removeSkill(skill: string): void {
    const index = this.skills.value.indexOf(skill);

    if (index >= 0) {
      const newSkills = [...this.skills.value];
      newSkills.splice(index, 1);
      this.skills.setValue(newSkills);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.setValue([...this.skills.value, event.option.viewValue]);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSkills.filter(skill => skill.toLowerCase().includes(filterValue));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.skillsForm.patchValue({ resume: file });
      this.skillsForm.get('resume')?.updateValueAndValidity();
    }
  }
}