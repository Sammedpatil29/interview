import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { InterviewService } from '../../../services/interview.service';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-assign-hr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-hr.component.html',
  styleUrl: './assign-hr.component.css',
})
export class AssignHrComponent implements OnInit {
  hrs: any[] = [];
  isLoading = false;
  selectedHr: any = null;
  interviewDetails: any;
  readonly dialog = inject(MatDialog);


  constructor(
    public dialogRef: MatDialogRef<AssignHrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private interviewService: InterviewService
  ) {
    this.interviewDetails = data;
  }

  ngOnInit(): void {
    this.loadHrs();
  }

  loadHrs(): void {
    this.isLoading = true;
    this.interviewService.getHrList().subscribe((res: any) => {
      this.hrs = res;
      if (this.interviewDetails?.hr) {
        this.selectedHr = this.hrs.find(h => h.id === this.interviewDetails.hr);
      }
      this.isLoading = false;
    });
  }

  isHrSelected(hr: any): boolean {
    return this.selectedHr && this.selectedHr.id === hr.id;
  }

  selectHr(hr: any): void {
    this.selectedHr = hr;
  }

  assignHr(): void {
    let params = {
      hr: {
        id: this.selectedHr.id,
        name: this.selectedHr.name
      }
    }
    this.interviewService.updateInterview(this.interviewDetails.id, params).subscribe((res:any)=>{
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'success',
          body: 'HR Assigned Successfully',
          type: 'success'
        }
      })
this.dialogRef.close(this.selectedHr);
    }, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'error',
          body: 'Something went wrong',
          type: 'error'
        }
      })
    })
    
  }

  close(): void {
    this.dialogRef.close();
  }
}