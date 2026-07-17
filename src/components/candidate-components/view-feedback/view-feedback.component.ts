import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DetailedFeedback {
  questionAsked: string;
  comment: string;
  rating: number;
}

interface FeedbackData {
  feedback: string;
  recommendations: string;
  detailedFeedback: DetailedFeedback[];
}

export interface ViewFeedbackDialogData {
  feedback: FeedbackData;
  candidateName?: string;
  interviewerName?: string;
  interviewDate?: string | Date;
}

@Component({
  selector: 'app-view-feedback',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit {

  feedbackData!: FeedbackData;

  candidateName = '';
  interviewerName = '';
  interviewDate!: Date | string;

  averageRating = 0;
  currentDate = new Date();
  reportNumber = '';
  isGenerating = false;

  constructor(
    public dialogRef: MatDialogRef<ViewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.feedbackData = this.data.feedback;
      this.candidateName = this.data.candidateName ?? 'N/A';
      this.interviewerName = this.data?.interviewer?.name ?? 'N/A';
      this.interviewDate = this.data.interviewDate ?? new Date();

      this.calculateAverageRating();
      this.generateReportNumber();
    }
  }

  /** Calculate Average Rating */
  calculateAverageRating(): void {
    if (
      !this.feedbackData ||
      !this.feedbackData.detailedFeedback ||
      this.feedbackData.detailedFeedback.length === 0
    ) {
      this.averageRating = 0;
      return;
    }

    const total = this.feedbackData.detailedFeedback.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    this.averageRating = Number(
      (total / this.feedbackData.detailedFeedback.length).toFixed(1)
    );
  }

  /** Report Number — e.g. REP-240717-5823 */
  generateReportNumber(): void {
    const today = new Date();
    const date =
      today.getFullYear().toString().slice(2) +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      ('0' + today.getDate()).slice(-2);

    const random = Math.floor(1000 + Math.random() * 9000);
    this.reportNumber = `REP-${date}-${random}`;
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(10 - Math.round(rating)).fill(0);
  }

  get ratingPercentage(): number {
    return this.averageRating * 10;
  }

  get ratingColor(): string {
    if (this.averageRating >= 8) return '#198754';
    if (this.averageRating >= 6) return '#ffc107';
    return '#dc3545';
  }

  get performanceGrade(): string {
    if (this.averageRating >= 9) return 'Outstanding';
    if (this.averageRating >= 8) return 'Excellent';
    if (this.averageRating >= 7) return 'Very Good';
    if (this.averageRating >= 6) return 'Good';
    if (this.averageRating >= 5) return 'Average';
    return 'Needs Improvement';
  }

  /** Generate & download a multi-page A4 PDF of the report */
  async downloadPDF(): Promise<void> {
    const element = document.getElementById('pdfContent');
    if (!element || this.isGenerating) return;

    this.isGenerating = true;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeName = (this.candidateName || 'Candidate').replace(/\s+/g, '_');
      pdf.save(`Interview-Report-${safeName}-${this.reportNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      this.isGenerating = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}