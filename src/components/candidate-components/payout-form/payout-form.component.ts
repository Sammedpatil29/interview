import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InterviewService } from '../../../services/interview.service';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';
import { LoaderComponent } from "../../public-components/loader/loader.component";

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
    LoaderComponent
],
  templateUrl: './payout-form.component.html',
  styleUrl: './payout-form.component.css'
})
export class PayoutFormComponent implements OnInit {
  data: any = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<PayoutFormComponent>);

  upiId: string = '';
  amount: number = 0;
  requestId: string = '';
  transactionId: string = '';
  qrData: string | null = null;
  isLoading: boolean = false;

  readonly dialog = inject(MatDialog);


  constructor(private interviewService: InterviewService){}

  ngOnInit(): void {
    if (this.data) {
      this.requestId = this.data.id;
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

  confirmPayout(){
    let params = {
      status: 'completed',
      utrId: this.transactionId
    }
    this.isLoading = true
    this.interviewService.confirmPayout(this.requestId, params).subscribe((res:any)=>{
      this.isLoading = false
      this.dialog.open(AlertDialogComponent, {
        data : {
          title: 'success',
          body: 'Payout Processed Successfully',
          type: 'success'
        }
      })
      this.dialogRef.close(true)
    }, error => {
      this.isLoading = false
      this.dialog.open(AlertDialogComponent, {
        data : {
          title: 'error',
          body: 'Something went wrong',
          type: 'error'
        }
      })
    })
  }
}
