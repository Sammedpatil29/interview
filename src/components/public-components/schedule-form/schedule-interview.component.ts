import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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
import { Observable, of, throwError, startWith, map, timer, switchMap, retry, take, tap } from 'rxjs';
import { InterviewService } from '../../../services/interview.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from "../loader/loader.component";

declare var Razorpay: any;

interface PaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  interviewId: string;
}

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
    MatIconModule,
    LoaderComponent
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
  isLoading: boolean = false;
  maxDate: any;
  amount: number = 0;
  isHomePage: boolean = false;
  bookingSuccess: boolean = false;

  private readonly pollInterval = 3000; // 3 seconds
  private readonly maxRetries = 20; // Total 60 seconds

  allSkills: string[] = ['Angular', 'React', 'Vue', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Java', 'Python', 'AWS', 'Docker'];
  filteredSkills!: Observable<string[]>;
  skillCtrl = new FormControl();

  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;

  constructor(private interviewService: InterviewService, private dialog: MatDialog){}

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

    this.personalDetailsForm.get('experienceLevel')?.valueChanges.subscribe(value => {
      if (value === 'fresher') {
        this.amount = 1200;
      } else if (value === 'intermediate') {
        this.amount = 1800;
      } else if (value === 'experienced') {
        this.amount = 2400;
      }
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

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.hasOwnProperty('Razorpay')) {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Razorpay SDK could not be loaded.');
      document.body.appendChild(script);
    });
  }

  scheduleInterview() {
    if (this.personalDetailsForm.invalid || this.skillsForm.invalid || this.slotsForm.invalid) return;
    const personalDetails = this.personalDetailsForm.value;
    const skillsDetails = this.skillsForm.value;
    const slotsDetails = this.slotsForm.value;

    const payload = {
      ...personalDetails,
      ...skillsDetails,
      slots: slotsDetails,
      amount: this.amount
      // The other properties like schedule, hr, interviewer, payment, etc.
      // will likely be added by your backend service upon processing.
    };
    
    this.isLoading = true;
    this.loadRazorpayScript().then(() => {
      this.interviewService.createInterview(payload).subscribe((res:any)=>{
        this.isLoading = false;
        if (res && res.data.razorpayOrderId) {
          this.payWithRazorpay(res);
        } else {
          // Handle case where order creation failed on backend but interview was created
          console.error('Could not get order_id from the server.');
          this.bookingSuccess = true; // Or show an error
        }
      }, err => {
        this.isLoading = false;
        console.error('Interview creation failed:', err);
        // TODO: Show user-friendly error dialog
      });
    }).catch(error => console.error(error));
  }

  payWithRazorpay(data: any) {
    const options = {
      key: environment.razorpay_id,
      amount: data.data.razorpayOrderId, // Amount is in currency subunits.
      currency: 'INR',
      name: 'Mock Interview Booking',
      description: `Interview for ${this.personalDetailsForm.value.candidateName}`,
      order_id: data.data.razorpayOrderId,
      handler: (response: any) => {
        this.isLoading = true;
        const paymentData: PaymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          interviewId: data.data.id
        };
        this.triggerPaymentVerification(paymentData);
      },
      modal: {
        ondismiss: () => {
          this.isLoading = false;
          // Optionally, inform the user that payment was not completed.
          console.log('Payment modal closed by user.');
          alert('Payment was not completed. Please try again.');
        }
      },
      prefill: { name: this.personalDetailsForm.value.candidateName, email: this.personalDetailsForm.value.candidateEmail, contact: this.personalDetailsForm.value.mobileNumber },
      theme: { color: '#6f42c1' }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  private triggerPaymentVerification(paymentData: PaymentData): void {
    this.interviewService.verifyPayment(paymentData).subscribe({
      next: (res) => {
        // The backend returns 200 on successful verification.
        this.isLoading = false;
        this.bookingSuccess = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Payment verification failed:', err);
        this.bookingSuccess = false; 
        alert('Payment verification failed. Please contact support with your payment details.');
      }
    });
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