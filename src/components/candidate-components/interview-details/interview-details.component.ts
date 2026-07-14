import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent],
  templateUrl: './interview-details.component.html',
  styleUrl: './interview-details.component.css'
})
export class InterviewDetailsComponent implements OnInit {
  @Input() id: any;
  interviewDetails: any;
  role:any;
  // This is sample data. In a real app, you'd fetch this from a service.
  private allInterviews = [
    {
      id: 1,
      candidateName: "Sammed ",
      candidateEmail: "sammed.patil29@gmail.com",
      mobileNumber: "9591420068",
      experienceLevel: "fresher",
      type: "front",
      skills: [
          "Angular"
      ],
      resume: null,
      slots: {
        "slot1": {
          "date": "2026-07-14T18:30:00.000Z",
          "time": "10:00"
      },
      "slot2": {
          "date": "2026-07-14T18:30:00.000Z",
          "time": "03:00"
      },
      "slot3": {
          "date": "2026-07-14T18:30:00.000Z",
          "time": "11:00"
      }
      },
      schedule:{
        "date": "2026-07-14T18:30:00.000Z",
        "time": "11:00"
      },
      hr: {
          id: 1,
          name: "random name"
      },
      interviewer: {
          id: 1,
          name: "random name",
          role: "Full Stack developer",
          exp: "6 years"
      },
      payment: "paid",
      amount: "1200",
      interviewerShare: "350",
      timeline: [
          {
              status: "paid",
              date: "2026-07-14T18:30:00.000Z",
              comment: "user just paid"
          }
      ],
      meetingUrl: "https://meet.google.com/ivx-bzuq-mfb"
    }
  ];

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.interviewDetails = this.allInterviews.find(i => i.id == this.id);
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
}