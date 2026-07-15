import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewDetailsComponent } from "../interview-details/interview-details.component";
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from "../../public-components/loader/loader.component";

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, InterviewDetailsComponent, LoaderComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.css'
})
export class InterviewsComponent implements OnInit{
  id:any;
  role:any;
  isLoading: boolean = true;
  interviews:any = [];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private interviewService: InterviewService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
    this.getInterviews()
  }

  viewDetails(id:any){
    this.router.navigate([], {
      queryParams: {
        id: id
      },
      queryParamsHandling: 'merge' // 'merge' keeps existing query params, 'preserve' keeps old ones completely, default replaces them
    });
  }

  getInterviews(){
    const token = sessionStorage.getItem('token')
    let headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
this.isLoading = true;
this.interviewService.getInterviews(headers).subscribe((res:any)=>{
  this.interviews = res
  this.isLoading = false;
}, error => {
  this.isLoading = false;
})
  }

   objectKeys(obj: object): string[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${String(formattedHour).padStart(2, '0')}:${minute} ${ampm}`;
  }

  isJoinEnabled(interviewDetails:any): boolean {
  if (!interviewDetails?.schedule) {
    return false;
  }

  const { date, time } = interviewDetails.schedule;

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
}