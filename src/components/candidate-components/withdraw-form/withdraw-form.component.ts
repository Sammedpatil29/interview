import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
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

  constructor(private interviewService: InterviewService){}

  ngOnInit(): void {
    this.interviewService.getUpi().subscribe((res:any)=>{
      this.upiId = res.upi;
    })
  }
}
