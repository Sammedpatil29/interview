import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from "../../public-components/no-data/no-data.component";
import { AuthService } from '../../../services/auth.service';
import { InterviewService } from '../../../services/interview.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';
import { LoaderComponent } from "../../public-components/loader/loader.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  dashboardCards:any = []
  isLoading = false
  readonly dialog = inject(MatDialog)
  role:any;

  constructor(private authService: AuthService, private interviewService: InterviewService){}

  ngOnInit(): void {
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
    this.getDashboard()
  }

  getDashboard(){
    this.isLoading = true
 this.interviewService.getDashboard().subscribe((res:any)=>{
  this.dashboardCards = res
  this.isLoading = false
 }, error => {
  this.isLoading = false
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