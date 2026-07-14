import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../login/login.component';
import { FooterComponent } from "../footer/footer.component";
import { ScheduleInterviewComponent } from "../schedule-form/schedule-interview.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, ScheduleInterviewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
readonly dialog = inject(MatDialog);

 openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { type: 'add' },
      maxWidth: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined || result == 'true') {
      }
      console.log(`Dialog result: ${result}`);
    });
  }
}
