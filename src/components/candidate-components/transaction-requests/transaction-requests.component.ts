import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from '../../public-components/loader/loader.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-transaction-requests',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent],
  templateUrl: './transaction-requests.component.html',
  styleUrl: './transaction-requests.component.css'
})
export class TransactionRequestsComponent implements OnInit {
  pendingRequests: any[] = [];
  isLoading = false;
  readonly dialog = inject(MatDialog);

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.getPendingRequests();
  }

  getPendingRequests(): void {
    this.isLoading = true;
    this.interviewService.pendingTransactionRequests().subscribe((res: any) => {
      // Filter for interviews that are pending payment approval
      this.pendingRequests = res;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error('Error fetching interviews:', error);
    });
  }

  approveRequest(interviewId: string): void {
    this.interviewService.approveTransaction(interviewId).subscribe(() => {
      this.getPendingRequests();
    });
  }
}
