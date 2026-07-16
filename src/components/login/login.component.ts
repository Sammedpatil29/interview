import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; // 1. Import Form Field
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private loginService: LoginService, private authService: AuthService){}

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
  let params = {
    contact: this.mobileNumber,
    password: this.password
  }
  this.loginService.candidateLogin(params).subscribe((res:any)=>{
    this.authService.login(res.token);
     this.dialogRef.close();
    this.router.navigate(['/candidate'])
  })
} else if(this.userType == 'hr'){
  let params = {
    contact: this.mobileNumber,
    password: this.password
  }
  this.loginService.hrLogin(params).subscribe((res:any)=>{
    this.authService.login(res.token);
    this.dialogRef.close();
    this.router.navigate(['/candidate'])
  })
} else {
  let params = {
    contact: this.mobileNumber,
    password: this.password
  }
  this.loginService.interviewerLogin(params).subscribe((res:any)=>{
    this.authService.login(res.token);
    this.dialogRef.close();
    this.router.navigate(['/candidate'])
  })
  
}
  }

}
