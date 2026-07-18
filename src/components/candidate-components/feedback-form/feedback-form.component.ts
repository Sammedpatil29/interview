import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InterviewService } from '../../../services/interview.service';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './feedback-form.component.html',
  styleUrl: './feedback-form.component.css',
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  isSaving: boolean = false
  isSubmitting: boolean = false
  private intervalId: any;
  readonly dialog = inject(MatDialog);


  constructor(
    public dialogRef: MatDialogRef<FeedbackFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private interviewService: InterviewService
  ) {
    this.feedbackForm = this.fb.group({
      detailedFeedback: this.fb.array([]),
      feedback: ['', Validators.required],
      recommendations: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.feedback) {
      this.feedbackForm.patchValue({
        feedback: this.data.feedback.feedback,
        recommendations: this.data.feedback.recommendations,
      });

      if (this.data.feedback.detailedFeedback && this.data.feedback.detailedFeedback.length > 0) {
        this.data.feedback.detailedFeedback.forEach((detail: any) => {
          this.detailedFeedback.push(this.createDetailedFeedbackRowWithValue(detail));
        });
      } else {
        this.addDetailedFeedbackRow();
      }
    } else {
      this.addDetailedFeedbackRow(); // Start with one row if no data
    }
    this.intervalId = setInterval(() => {
    this.autoSave();
  }, 10000);
  }

  ngOnDestroy() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}

  get detailedFeedback(): FormArray {
    return this.feedbackForm.get('detailedFeedback') as FormArray;
  }

  createDetailedFeedbackRow(): FormGroup {
    return this.fb.group({
      questionAsked: ['', Validators.required],
      comment: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }
  
  createDetailedFeedbackRowWithValue(detail: any): FormGroup {
    return this.fb.group({
      questionAsked: [detail.questionAsked, Validators.required],
      comment: [detail.comment, Validators.required],
      rating: [detail.rating, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  addDetailedFeedbackRow(): void {
    this.detailedFeedback.push(this.createDetailedFeedbackRow());
  }

  removeDetailedFeedbackRow(index: number): void {
    this.detailedFeedback.removeAt(index);
  }

  submitFeedback(): void {
    this.isSubmitting = true
    let params = {
      feedback: this.feedbackForm.value
    }
    this.interviewService.updateFeedback(this.data.id, params).subscribe((res:any)=>{
      this.isSubmitting = false
      console.log(res)
      this.dialogRef.close(true);
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'success',
          body: 'Feedback Added Successfully!',
          type: 'success'
        }
      })
    },error => {
      this.isSaving = false
      this.dialog.open(AlertDialogComponent,{
        data: {
          title: 'error',
          body: 'error occured',
          type: 'error'
        }
      })
    })
  }

  autoSave(){
    this.isSaving = true
    let params = {
      feedback: this.feedbackForm.value
    }
    this.interviewService.autoSaveFeedback(this.data.id, params).subscribe((res:any)=>{
      this.isSaving = false
      console.log(res)
    },error => {
      this.isSaving = false
    })
  }

  close(): void {
    this.dialogRef.close();
  }
}