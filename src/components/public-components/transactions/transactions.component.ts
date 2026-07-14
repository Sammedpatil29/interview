import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoDataComponent } from '../no-data/no-data.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoDataComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  summaryCards = [
    { title: 'Total Earned', value: '₹5,500', icon: 'account_balance_wallet', color: 'success' },
    { title: 'Total Withdrawn', value: '₹4,000', icon: 'arrow_circle_up', color: 'warning' },
    { title: 'Total Spent', value: '₹2,499', icon: 'shopping_cart', color: 'danger' },
  ];

  transactions = [
    {
      id: 'txn_123',
      date: new Date(),
      description: 'Payment for Mock Interview (Backend)',
      type: 'Debit',
      amount: 499,
      status: 'Completed'
    },
    {
      id: 'txn_124',
      date: new Date('2024-07-20'),
      description: 'Payout for completed interview',
      type: 'Credit',
      amount: 500,
      status: 'Completed'
    },
    {
      id: 'txn_125',
      date: new Date('2024-07-18'),
      description: 'Withdrawal to Bank Account',
      type: 'Debit',
      amount: 1000,
      status: 'Pending'
    }
  ];
}