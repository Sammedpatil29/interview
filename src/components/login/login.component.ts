import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; // 1. Import Form Field
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);
password: any;
mobileNumber: any;

  userType = ''

  constructor(private router: Router){}

  ngOnInit(): void {
    
  }
  
  openForm(type:any){
    this.userType = type
  }

  closeDialog(){
    this.dialogRef.close();
  }
  
  logIn() {
if(this.userType == 'candidate'){
  this.dialogRef.close();
this.router.navigate(['/candidate-login'])
}
}

}
