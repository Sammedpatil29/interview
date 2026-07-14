import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
    name: 'Rakesh Sharma',
    email: 'rakesh.sharma@example.com',
    mobileNumber: '9876543210',
    experienceLevel: 'fresher',
    skills: ['Angular', 'Node.js', 'SQL'],
    resume: { name: 'rakesh_sharma_resume.pdf' },
    // Using a placeholder image service for the avatar
    avatar: 'https://i.pravatar.cc/150?u=rakesh'
  };
}