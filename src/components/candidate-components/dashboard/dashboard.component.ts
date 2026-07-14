import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from "../../public-components/no-data/no-data.component";
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  dashboardCards = [
    { title: 'Total Interviews', value: '12', icon: 'work_history', color: 'primary' },
    { title: 'Active Interviews', value: '2', icon: 'pending_actions', color: 'info' },
    { title: 'Interviews Taken', value: '10', icon: 'task_alt', color: 'success' },
    { title: 'Amount Spent', value: '₹2,499', icon: 'shopping_cart', color: 'danger' },
    { title: 'Amount Earned', value: '₹500', icon: 'account_balance_wallet', color: 'warning' },
    { title: 'Wallet Balance', value: '₹1,500', icon: 'account_balance', color: 'purple' }
  ];

  role:any;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
    })
  }
}