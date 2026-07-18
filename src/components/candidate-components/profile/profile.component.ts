import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../public-components/loader/loader.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, MatIconModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  role: any;
  id:any;
  isLoading = false;
  user:any

  constructor(private interviewService: InterviewService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.role$.subscribe((res: any) => {
      this.role = res?.role;
      this.id = res?.id;
    });
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (this.role) {

      if (this.id && this.role) {
        this.isLoading = true;
        this.interviewService.getProfile(this.id, this.role).subscribe({
          next: (res: any) => {
            this.user = res;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load profile:', err);
            this.isLoading = false;
            // Optionally, show an error message to the user
          }
        });
      }
    } else {
      console.error('User data not found in session storage.');
      // Optionally, redirect to login
    }
  }
}
