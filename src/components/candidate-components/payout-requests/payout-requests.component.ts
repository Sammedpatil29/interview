import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from '../../public-components/loader/loader.component';
import { MatDialog } from '@angular/material/dialog';
import { PayoutFormComponent } from '../payout-form/payout-form.component';

@Component({
  selector: 'app-payout-requests',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, LoaderComponent],
  templateUrl: './payout-requests.component.html',
  styleUrl: './payout-requests.component.css'
})
export class PayoutRequestsComponent implements OnInit {
  payoutRequests: any[] = [];
  isLoading = false;
  readonly dialog = inject(MatDialog);

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.getPendingPayouts();
  }

  getPendingPayouts(): void {
    this.isLoading = true;
    // Assuming you will have a service method to get payout requests
    // For now, I'll use a placeholder with mock data.
    // Replace this with your actual API call.
    setTimeout(() => {
      this.payoutRequests = [
        { id: 'payout1', interviewerName: 'John Doe', upiId: '9591420068kbl@ybl', amount: 1500 },
        { id: 'payout2', interviewerName: 'Jane Smith', upiId: 'jane.smith@upi', amount: 2500 },
      ];
      this.isLoading = false;
    }, 1000);
  }

  processPayout(request: any): void {
    this.dialog.open(PayoutFormComponent, {
      data: {
        upiId: request?.upiId,
        amount: request.amount
      }
    })
  }
}