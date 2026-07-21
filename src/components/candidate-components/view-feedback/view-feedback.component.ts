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

interface Block {
  top: number;
  bottom: number;
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

  // Footer band height reserved on every PDF page (mm)
  private readonly FOOTER_HEIGHT_MM = 16;
  private readonly CANVAS_SCALE = 2;

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

  /**
   * Generate a multi-page A4 PDF where:
   *  - the header (logo + title block) repeats identically on every page
   *  - the footer repeats identically on every page
   *  - page breaks never cut through a card/row (dynamic pagination)
   */
  async downloadPDF(): Promise<void> {
    const container = document.getElementById('pdfContent');
    if (!container || this.isGenerating) return;

    this.isGenerating = true;

    const footerEl = container.querySelector('.footer') as HTMLElement | null;
    const originalFooterDisplay = footerEl?.style.display ?? '';

    try {
      // Hide the HTML footer — we redraw it natively per page instead
      if (footerEl) footerEl.style.display = 'none';

      await this.waitForImages(container);

      // Where the header block ends and scrollable body content begins
      const headerBottomPx = this.getHeaderHeightPx(container);
      const blocks = this.getAvoidBreakBlocks(container, headerBottomPx);
      const totalHeightPx = container.scrollHeight;

      const canvas = await html2canvas(container, {
        scale: this.CANVAS_SCALE,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: container.scrollWidth,
        windowHeight: totalHeightPx
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidthMM = pdf.internal.pageSize.getWidth();
      const pageHeightMM = pdf.internal.pageSize.getHeight();
      const pxPerMm = canvas.width / pageWidthMM;

      // ---- Crop the header once, reused as an image on every page ----
      const headerCanvasPx = Math.round(headerBottomPx * this.CANVAS_SCALE);
      const headerCanvas = this.cropCanvas(canvas, 0, headerCanvasPx);
      const headerImgData = headerCanvas.toDataURL('image/png');
      const headerHeightMM = headerCanvasPx / pxPerMm;

      // ---- Usable body area per page, after reserving header + footer ----
      const bodyHeightMM = pageHeightMM - headerHeightMM - this.FOOTER_HEIGHT_MM;
      const idealPageHeightPx = (bodyHeightMM * pxPerMm) / this.CANVAS_SCALE;

      const bodyTotalHeightPx = totalHeightPx - headerBottomPx;
      const localCutPointsPx = this.computeCutPoints(bodyTotalHeightPx, idealPageHeightPx, blocks);
      const totalPages = localCutPointsPx.length;

      let prevCutLocal = 0;

      for (let i = 0; i < totalPages; i++) {
        const sliceStartLocal = prevCutLocal;
        const sliceEndLocal = localCutPointsPx[i];
        const sliceHeightLocal = sliceEndLocal - sliceStartLocal;

        if (sliceHeightLocal <= 0) {
          prevCutLocal = sliceEndLocal;
          continue;
        }

        const canvasSliceStart = headerCanvasPx + Math.round(sliceStartLocal * this.CANVAS_SCALE);
        const canvasSliceHeight = Math.round(sliceHeightLocal * this.CANVAS_SCALE);

        const bodySliceCanvas = this.cropCanvas(canvas, canvasSliceStart, canvasSliceHeight);
        const bodyImgData = bodySliceCanvas.toDataURL('image/png');
        const bodyImgHeightMM = canvasSliceHeight / pxPerMm;

        if (i > 0) pdf.addPage();

        // Header — identical on every page
        pdf.addImage(headerImgData, 'PNG', 0, 0, pageWidthMM, headerHeightMM);

        // Body slice for this page
        pdf.addImage(bodyImgData, 'PNG', 0, headerHeightMM, pageWidthMM, bodyImgHeightMM);

        // Footer — identical on every page
        this.drawFooter(pdf, i + 1, totalPages, pageWidthMM, pageHeightMM);

        prevCutLocal = sliceEndLocal;
      }

      const safeName = (this.candidateName || 'Candidate').replace(/\s+/g, '_');
      pdf.save(`Interview-Report-${safeName}-${this.reportNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      if (footerEl) footerEl.style.display = originalFooterDisplay;
      this.isGenerating = false;
    }
  }

  /** Waits for all <img> tags inside the report to finish loading */
  private waitForImages(container: HTMLElement): Promise<void> {
    const imgs = Array.from(container.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>(resolve => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    });
    return Promise.all(promises).then(() => undefined);
  }

  /** Height (px, unscaled) of the repeating header block: logo bar */
  private getHeaderHeightPx(container: HTMLElement): number {
    const headerEl = container.querySelector('.letter-head') as HTMLElement | null;
    if (!headerEl) return 0;

    const containerTop = container.getBoundingClientRect().top;
    const headerBottom = headerEl.getBoundingClientRect().bottom;
    return headerBottom - containerTop;
  }

  /**
   * Collects bounding boxes (relative to the start of body content, i.e.
   * after the header) of elements that must never be split across a page
   * break.
   */
  private getAvoidBreakBlocks(container: HTMLElement, headerBottomPx: number): Block[] {
    const selector = '.info-card, .score-section, .custom-table tr, .feedback-card';
    const els = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    const containerTop = container.getBoundingClientRect().top;

    return els
      .map(el => {
        const r = el.getBoundingClientRect();
        return {
          top: (r.top - containerTop) - headerBottomPx,
          bottom: (r.bottom - containerTop) - headerBottomPx
        };
      })
      .filter(b => b.bottom > 0)
      .sort((a, b) => a.top - b.top);
  }

  /**
   * Walks down the body content picking page-break points close to the
   * ideal page height, but shifted earlier if they'd otherwise land inside
   * a protected block (a card, a table row, etc.).
   */
  private computeCutPoints(totalHeight: number, idealPageHeight: number, blocks: Block[]): number[] {
    const cuts: number[] = [];
    let current = 0;

    while (current < totalHeight - 1) {
      const idealCut = current + idealPageHeight;

      if (idealCut >= totalHeight) {
        cuts.push(totalHeight);
        break;
      }

      const breakingBlock = blocks.find(b => idealCut > b.top + 1 && idealCut < b.bottom - 1);
      let cut = idealCut;

      if (breakingBlock) {
        cut = breakingBlock.top;
        // Guard against near-empty pages if the block starts right after 'current'
        if (cut <= current + 20) {
          cut = breakingBlock.bottom;
        }
      }

      cuts.push(cut);
      current = cut;
    }

    return cuts.length ? cuts : [totalHeight];
  }

  /** Crops a region out of a source canvas and returns it as a new canvas */
  private cropCanvas(source: HTMLCanvasElement, startY: number, height: number): HTMLCanvasElement {
    const cropped = document.createElement('canvas');
    cropped.width = source.width;
    cropped.height = height;

    const ctx = cropped.getContext('2d')!;
    ctx.drawImage(
      source,
      0, startY, source.width, height,
      0, 0, source.width, height
    );

    return cropped;
  }

  /** Draws the footer bar natively on the given PDF page */
  private drawFooter(pdf: jsPDF, pageNum: number, totalPages: number, pageWidthMM: number, pageHeightMM: number): void {
    const y = pageHeightMM - this.FOOTER_HEIGHT_MM;
    const textY = y + this.FOOTER_HEIGHT_MM / 2 + 3;

    pdf.setFillColor(15, 37, 64); // #0f2540
    pdf.rect(0, y, pageWidthMM, this.FOOTER_HEIGHT_MM, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);

    const dateStr = `Generated on ${this.currentDate.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })}`;
    pdf.text(dateStr, 10, textY);

    const rightText = 'Demo Company • Confidential';
    const rightTextWidth = pdf.getTextWidth(rightText);
    pdf.text(rightText, pageWidthMM - 10 - rightTextWidth, textY);

    pdf.setFontSize(8);
    pdf.setTextColor(200, 210, 225);
    const pageText = `Page ${pageNum} of ${totalPages}`;
    const pageTextWidth = pdf.getTextWidth(pageText);
    pdf.text(pageText, pageWidthMM / 2 - pageTextWidth / 2, textY);
  }

  close(): void {
    this.dialogRef.close();
  }
}