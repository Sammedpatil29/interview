import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterviewService } from '../../../services/interview.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reschedule',
  templateUrl: './reschedule.component.html',
  styleUrl: './reschedule.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class RescheduleComponent implements OnInit{
  interviewDetails: any = inject(MAT_DIALOG_DATA); 
  private dialogRef = inject(MatDialogRef<RescheduleComponent>);

  isLoading:boolean = false;

  rescheduleForm: FormGroup;
  selectedSlot: { date: string; time: string } | null = null;
  minDate: Date;
  interviewers: any = [];
  selectedInterviewer: { id: string; name: string; role: string; exp: string; } | null = null;

  constructor(private fb: FormBuilder, private interviewService: InterviewService, private cdr: ChangeDetectorRef){
    this.minDate = new Date();
    this.rescheduleForm = this.fb.group({
      date: [null],
      time: [null],
      meetingUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInterviewers();
    // If there's an existing meeting URL, pre-fill that input.
    if (this.interviewDetails?.meetingUrl) {
      this.rescheduleForm.patchValue({
        meetingUrl: this.interviewDetails.meetingUrl
      });
    }
    // If an interviewer is already assigned, pre-select them.
    if (this.interviewDetails?.interviewer) {
      this.selectedInterviewer = {
        id: this.interviewDetails.interviewer.id,
        name: this.interviewDetails.interviewer.name,
        role: this.interviewDetails.interviewer.designation, // Assuming 'exp' is the designation
        exp: this.interviewDetails.interviewer.experience, // Assuming 'exp' is the designation
      };
    }
  }

  getInterviewers(): void {
    this.isLoading = true
    this.interviewService.getInterviewers().subscribe(res => {
       this.isLoading = false
       this.interviewers = res;
       this.cdr.markForCheck(); // Manually trigger change detection
    }, error => {
       this.isLoading = false
       this.cdr.markForCheck(); // Also trigger on error
    });
  }

  objectKeys(obj: object): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${String(formattedHour).padStart(2, '0')}:${minute} ${ampm}`;
  }

  selectSlot(slot: { date: string; time: string }): void {
    this.selectedSlot = { date: slot.date, time: slot.time };
    // Clear custom date/time if a preferred slot is chosen
    this.rescheduleForm.patchValue({ date: null, time: null });
  }

  isSlotSelected(slot: { date: string; time: string }): boolean {
    return this.selectedSlot?.date === slot.date && this.selectedSlot?.time === slot.time;
  }
  
  clearSelectedSlot(): void {
    this.selectedSlot = null;
  }

  selectInterviewer(interviewer: any): void {
    this.selectedInterviewer = {
      id: interviewer.id,
      name: interviewer.name,
      role: interviewer.designation, // Assuming 'exp' is the designation
      exp: interviewer.experience, // Assuming 'exp' is the designation
    };
  }

  isInterviewerSelected(interviewer: any): boolean {
    return this.selectedInterviewer?.id === interviewer.id;
  }

  isFormValid(): boolean {
    const isSlotSelected = !!this.selectedSlot;
    const isCustomDateTimeSelected = this.rescheduleForm.get('date')?.value && this.rescheduleForm.get('time')?.value;
    const isMeetingUrlPresent = this.rescheduleForm.get('meetingUrl')?.valid;
    const isInterviewerSelected = !!this.selectedInterviewer;

    return (isSlotSelected || isCustomDateTimeSelected) && isMeetingUrlPresent && isInterviewerSelected;
  }

  onReschedule(): void {
    if (!this.isFormValid()) {
      return;
    }

    const scheduleData = this.selectedSlot ? 
      { ...this.selectedSlot } : 
      { date: this.rescheduleForm.value.date, time: this.rescheduleForm.value.time };
    
    const payload = {
      schedule: scheduleData,
      meetingUrl: this.rescheduleForm.value.meetingUrl, // Correct
      interviewer: this.selectedInterviewer // Send the whole interviewer object
    };
    this.interviewService.updateInterview(this.interviewDetails.id, payload).subscribe((res:any)=>{
      console.log(res)
      this.dialogRef.close(true);
    })
    // 
  }

  close() {
    this.dialogRef.close();
  }
}
