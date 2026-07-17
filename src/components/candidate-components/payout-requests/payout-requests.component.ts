import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../../public-components/no-data/no-data.component';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from '../../public-components/loader/loader.component';
import { MatDialog } from '@angular/material/dialog';
import { PayoutFormComponent } from '../payout-form/payout-form.component';

@Component({
  selector: 'app-payout-requests',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent, NgIf, UpperCasePipe],
  templateUrl: './payout-requests.component.html',
  styleUrl: './payout-requests.component.css'
})
export class PayoutRequestsComponent implements OnInit {
  payoutRequests: any[] = [];
  completedRequests: any[] = [];
  isLoading = false;
  readonly dialog = inject(MatDialog);

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.getPendingPayouts();
  }

  getPendingPayouts(): void {
    this.isLoading = true;
    this.interviewService.getPayouts().subscribe((res:any)=>{
      this.isLoading = false
      this.payoutRequests = res.filter((request:any) => request.status === 'pending');
      this.completedRequests = res.filter((request:any) => request.status === 'completed');
    }, error => {
      this.isLoading = false
      console.error('Error fetching interviews:', error);
    })
  }

  processPayout(request: any): void {
    this.dialog.open(PayoutFormComponent, {
      data: {
        id: request.id,
        upiId: request?.upiId,
        amount: request.amount
      }
    }).afterClosed().subscribe((res:any)=>{
      if(res){
        this.getPendingPayouts()
      }
    })
  }
}