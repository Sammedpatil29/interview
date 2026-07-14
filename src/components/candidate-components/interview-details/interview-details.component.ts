import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { Router } from '@angular/router';

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

  ngOnInit(): void {
    this.interviewDetails = this.allInterviews.find(i => i.id == this.id);
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }
}