import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../no-data/no-data.component';
import { InterviewService } from '../../../services/interview.service';
import { LoaderComponent } from "../../public-components/loader/loader.component";
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawFormComponent } from '../../candidate-components/withdraw-form/withdraw-form.component';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent,LoaderComponent ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  summaryCards = [
    { title: 'Balance', value: 0, icon: 'account_balance_wallet', color: 'success' },
    { title: 'Under Process', value: 0, icon: 'arrow_circle_up', color: 'warning' },
    { title: 'Withdrawn', value: 0, icon: 'shopping_cart', color: 'danger' },
  ];

  transactions:any = []
  isLoading: boolean = false
  role:any;
  readonly dialog = inject(MatDialog)

  constructor(private interviewService: InterviewService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
    this.getTransactions()
  }

getTransactions(){
  this.isLoading = true
  this.interviewService.getTransactions().subscribe((res:any)=>{
    this.isLoading = false
    this.transactions = res.transactions.reverse()
    this.summaryCards[0].value = res.wallet.balance
    this.summaryCards[1].value = res.wallet.pending
    this.summaryCards[2].value = res.wallet.withdrawn

  }, error => {
    this.isLoading = false
  })

}

withdraw(){
  this.dialog.open(WithdrawFormComponent, {
    maxWidth: '30vw'
  }).afterClosed().subscribe((res:any)=>{
    if(res){
      this.getTransactions()
    }
  })
}
}