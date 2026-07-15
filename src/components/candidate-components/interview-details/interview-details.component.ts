import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { AuthService } from '../../../services/auth.service';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from "../../public-components/loader/loader.component";
import { MatDialog } from '@angular/material/dialog';
import { RescheduleComponent } from '../reschedule/reschedule.component';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';

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
  role:any;
  isLoading: boolean = false
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService, private interviewService: InterviewService){}

  ngOnInit(): void {
    this.getInterview()
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  isJoinEnabled(): boolean {
  if (!this.interviewDetails?.schedule) {
    return false;
  }

  const { date, time } = this.interviewDetails.schedule;

  // Parse date
  const interviewDate = new Date(date);

  // Parse time (HH:mm)
  const [hours, minutes] = time.split(':').map(Number);

  interviewDate.setHours(hours, minutes, 0, 0);

  const now = new Date();

  // Enable 15 minutes before interview
  const enableTime = new Date(interviewDate.getTime() - 15 * 60 * 1000);

  return now >= enableTime;
}

openMeeting(): void {
  if (!this.isJoinEnabled()) {
    return;
  }

  if (this.interviewDetails?.meetingUrl) {
    window.open(this.interviewDetails.meetingUrl, '_blank', 'noopener,noreferrer');
  }
}

getInterview(){
  this.isLoading = true;
this.interviewService.getInterviewById(this.id).subscribe((res:any)=>{
  this.interviewDetails = res
  this.isLoading = false;
}, error => {
  this.isLoading = false;
})
}

openReschedule() {
  const dialogRef = this.dialog.open(RescheduleComponent, {
    data: this.interviewDetails,
    minWidth: '74vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true || result === 'true') {
    this.getInterview();
  }
  });
}
}