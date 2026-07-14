import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewDetailsComponent } from "../interview-details/interview-details.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, InterviewDetailsComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.css'
})
export class InterviewsComponent implements OnInit{
  id:any;
  role:any;
  interviews = [
    {
      id: 1,
      candidateName: "rgrwg",
      candidateEmail: "df@g.y",
      mobileNumber: "4545454545",
      experienceLevel: "fresher",
      type: "backend",
      skills: ["Angular", "Node.js"],
      status: 'Pending',
      slots: [
        { date: "2026-07-12T18:30:00.000Z", time: "09:00 AM" },
        { date: "2026-07-13T18:30:00.000Z", time: "11:00 AM" },
        { date: null, time: null }
      ]
    },
    {
      id: 2,
      experienceLevel: "experienced",
      type: "frontend",
      skills: ["React", "TypeScript", "TailwindCSS"],
      status: 'Confirmed',
      slots: [
        { date: "2026-07-15T18:30:00.000Z", time: "02:00 PM" }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
  }

  viewDetails(id:any){
    this.router.navigate([], {
      queryParams: {
        id: id
      },
      queryParamsHandling: 'merge' // 'merge' keeps existing query params, 'preserve' keeps old ones completely, default replaces them
    });
  }
}