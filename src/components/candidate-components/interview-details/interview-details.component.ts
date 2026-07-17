import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { AuthService } from '../../../services/auth.service';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from "../../public-components/loader/loader.component";
import { MatDialog } from '@angular/material/dialog';
import { RescheduleComponent } from '../reschedule/reschedule.component';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';
import { AssignHrComponent } from '../assign-hr/assign-hr.component';
import { FeedbackFormComponent } from '../feedback-form/feedback-form.component';
import { ViewFeedbackComponent } from '../view-feedback/view-feedback.component';

@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, LoaderComponent, MatNativeDateModule],
    templateUrl: './interview-details.component.html',
  styleUrl: './interview-details.component.css'
})
export class InterviewDetailsComponent implements OnInit {
  @Input() id: any;
  interviewDetails: any;
  @ViewChild('timelineContainer') private timelineContainer!: ElementRef;
  role:any;
  isLoading: boolean = false
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService, private interviewService: InterviewService){}

  ngOnInit(): void {
    this.getInterview(true)
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  getInterviewState(): 'completed' | 'waiting_feedback' | 'feedback_received' | 'none' {
    const lastStatus = this.interviewDetails?.timeline[this.interviewDetails?.timeline.length - 1]?.status;
    if (lastStatus === 'Completed' || lastStatus === 'Cancelled') {
      return 'completed';
    }
    if (lastStatus === 'Feedback Added') {
      return 'feedback_received';
    }
    if (lastStatus === 'Waiting for Feedback') {
      return 'waiting_feedback';
    }
    return 'none';
  }

  isJoinEnabled():boolean {
  if (!this.interviewDetails?.schedule) {
    return false;
  }

  const { date, time } = this.interviewDetails.schedule;

  // Combine date and time into a single Date object for comparison
  const scheduledDateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  scheduledDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();

  // The window for joining is from 15 minutes before to 30 minutes after the scheduled time.
  const startTime = new Date(scheduledDateTime.getTime() - 15 * 60 * 1000);
  const endTime = new Date(scheduledDateTime.getTime() + 30 * 60 * 1000);

  return now >= startTime && now <= endTime;
}

openMeeting(): void {
  if (!this.isJoinEnabled()) {
    return;
  }

  this.dialog.open(AlertDialogComponent, {
    data: {
      title: 'warning',
      body: 'You wll be taken to an external website. Continue?',
      type: 'warning'
    }
  }).afterClosed().subscribe((res:any)=>{
    if(res){
      if (this.interviewDetails?.meetingUrl) {
    window.open(this.interviewDetails.meetingUrl, '_blank', 'noopener,noreferrer');
  }
    }
  })
}

getInterview(reload:any){
  if(reload){
    this.isLoading = true;
  }
this.interviewService.getInterviewById(this.id).subscribe((res:any)=>{
  this.interviewDetails = res
  this.isLoading = false;
  // Use a timeout to ensure the view is rendered before scrolling
  setTimeout(() => this.scrollToTimelineEnd(), 0);
}, error => {
  this.isLoading = false;
})
}

scrollToTimelineEnd(): void {
  try {
    if (this.timelineContainer?.nativeElement) {
      this.timelineContainer.nativeElement.scrollLeft = this.timelineContainer.nativeElement.scrollWidth;
    }
  } catch (err) { console.error(err); }
}

openReschedule() {
  const dialogRef = this.dialog.open(RescheduleComponent, {
    data: this.interviewDetails,
    minWidth: '74vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true || result === 'true') {
    this.getInterview(false);
  }
  });
}

cancel(){
  this.dialog.open(AlertDialogComponent, {
    data: {
      title: 'warning',
      body: "Sure you want to cancel the Interview?",
      type: 'warning'
    }
  }).afterClosed().subscribe((res:any)=>{
    if(res){
      let params = {
    timeline: {
      status: 'Cancelled',
      comment: 'Interview has been cancelled!'
    }
  }
  this.interviewService.updateInterview(this.id, params).subscribe((res:any)=>{
    this.getInterview(false);
  })
    }
  })
}

requestFeedback() {
  // Ensure interview has been scheduled and is in the past
  if (!this.interviewDetails || !this.interviewDetails.schedule) {
    return;
  }

  const params = {
    timeline: {
      status: 'Waiting for Feedback',
      comment: 'Feedback has been requested from the interviewer.'
    }
  };
  this.interviewService.updateInterview(this.id, params).subscribe(() => this.getInterview(true));
}

markComplete(){
  // Ensure interviewDetails and schedule exist before proceeding
  if (!this.interviewDetails || !this.interviewDetails.schedule) {
    console.warn('Cannot mark complete: Interview details or schedule not available.');
    // Optionally, you might want to show a user-friendly message here (e.g., using a MatSnackBar)
    return;
  }

  const { date, time } = this.interviewDetails.schedule;

  // Combine date and time into a single Date object for comparison
  const scheduledDateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  scheduledDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();

  // If the scheduled date and time are in the future, do not allow marking as complete/cancelled
  if (scheduledDateTime > now) {
    console.warn('Cannot mark complete/cancel: Interview is scheduled for a future date/time.');
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'error',
        body: 'Cannot mark complete: Interview is scheduled for a future date/time.',
        type: 'error'
      }
    })
    return;
  }

  this.dialog.open(AlertDialogComponent, {
    data: {
      title: 'success',
      body: 'Sure you want to mark as complete?',
      type: 'warning'
    }
  }).afterClosed().subscribe((res:any)=>{
    if(res){
      let params = {
    timeline: {
      status: 'Completed',
      comment: 'Interview has been Completed!'
    }
  }
  this.interviewService.updateInterview(this.id, params).subscribe((res:any)=>{
    this.getInterview(true);
  })
    }
  })
}

openHrWindow(){
  this.dialog.open(AssignHrComponent, {
    data: this.interviewDetails,
    minWidth: '50vw'
  }).afterClosed().subscribe((res:any)=>{
    if(res){
      this.getInterview(true);
    }
  })

}

openFeedback(){
  this.dialog.open(FeedbackFormComponent, {
    data: this.interviewDetails,
    minWidth: '75vw'
  }).afterClosed().subscribe((res)=>{
    this.getInterview(false)
  })
}

openViewFeedback(){
  this.dialog.open(ViewFeedbackComponent, {
    data: this.interviewDetails,
    minWidth: '75vw',
    maxHeight: '95vh'
  })
}


}