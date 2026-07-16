import { AlertDialogComponent } from './../../public-components/alert-dialog/alert-dialog.component';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InterviewService } from '../../../services/interview.service';

@Component({
  selector: 'app-withdraw-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './withdraw-form.component.html',
  styleUrl: './withdraw-form.component.css'
})
export class WithdrawFormComponent implements OnInit{
  upiId: string = '';
  readonly dialog = inject(MatDialog)
  private dialogRef = inject(MatDialogRef<WithdrawFormComponent>);
  constructor(private interviewService: InterviewService ){}

  ngOnInit(): void {
    this.interviewService.getUpi().subscribe((res:any)=>{
      this.upiId = res.upi;
    })
  }

  requestWithdraw(){
    let params = {
      upiId: this.upiId
    }
    this.interviewService.withdraw(params).subscribe((res:any)=>{
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'success',
          body: 'Withdrawal Request Received',
          type: 'success'
        }
      })
      this.dialogRef.close(true)
    })
  }
}
