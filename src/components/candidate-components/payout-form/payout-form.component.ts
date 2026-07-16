import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payout-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './payout-form.component.html',
  styleUrl: './payout-form.component.css'
})
export class PayoutFormComponent implements OnInit {
  data: any = inject(MAT_DIALOG_DATA);

  upiId: string = '';
  amount: number = 0;
  transactionId: string = '';
  qrData: string | null = null;

  ngOnInit(): void {
    if (this.data) {
      this.upiId = this.data.upiId;
      this.amount = this.data.amount;
    }
  }

  generateQrCode(): void {
    if (this.upiId && this.amount) {
      const upiData = `upi://pay?pa=${this.upiId}&pn=InterviewerPayout&am=${this.amount}&cu=INR`;
      this.qrData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiData)}`;
    }
  }
}
