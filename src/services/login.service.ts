import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
url = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  candidateLogin(params:any){
    return this.http.post(`${this.url}/api/candidate/candidateLogin`, params)
  }

 hrLogin(params:any){
  return this.http.post(`${this.url}/api/hr/login`, params)
 }
}
