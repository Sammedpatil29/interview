import { Component, OnInit, inject } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../public-components/loader/loader.component';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-interviewer-requests',
  standalone: true,
  imports: [CommonModule, LoaderComponent, NoDataComponent],
  templateUrl: './interviewer-requests.component.html',
  styleUrl: './interviewer-requests.component.css'
})
export class InterviewerRequestsComponent implements OnInit {
  inactiveInterviewers: any[] = [];
  isLoading = false;
  readonly dialog = inject(MatDialog);

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInactiveInterviewers();
  }

  loadInactiveInterviewers(): void {
    this.isLoading = true;
    this.interviewService.getInactiveInterviewers().subscribe({
      next: (res: any) => {
        this.inactiveInterviewers = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.dialog.open(AlertDialogComponent, { data: { title: 'Error', body: 'Failed to load interviewer requests.', type: 'error' } });
      }
    });
  }

  approveInterviewer(id: number): void {
    this.isLoading = true;
    this.interviewService.approveInterviewer(id, { status: 'active' }).subscribe({
      next: () => {
        this.dialog.open(AlertDialogComponent, { data: { title: 'Success', body: 'Interviewer has been approved.', type: 'success' } });
        this.loadInactiveInterviewers(); // Refresh the list
    }, 
    error: () => {
      this.isLoading = false;
      this.dialog.open(AlertDialogComponent, { data: { title: 'Error', body: 'Something went wrong. Please try again.', type: 'error' } });
    }});
  }
}