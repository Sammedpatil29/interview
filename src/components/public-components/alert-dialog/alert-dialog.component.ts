import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-alert-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, DragDropModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
 readonly dialog = inject(MatDialog);

  title: string;
  body: string;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
    this.body = data.body;
    this.type = data.type;
  }
}
