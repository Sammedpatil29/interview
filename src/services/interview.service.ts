import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
url = environment.apiUrl;
token = ''
  constructor(private http: HttpClient) {
    this.token = sessionStorage.getItem('token') || ''
   }

  createInterview(params:any){
    return this.http.post(`${this.url}/api/interview/`, params)
  }

  getInterviews(headers:any){
    return this.http.get(`${this.url}/api/interview/`, {headers: headers})
  }

  getInterviewById(id:any){
    let params = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    })
    return this.http.get(`${this.url}/api/interview/${id}`, {headers: params})
  }

  getInterviewers(){
    let params = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
  })
    return this.http.get(`${this.url}/api/interviewer/`, {headers: params})
  }
  
  updateInterview(id:any, params:any){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
  })
return this.http.put(`${this.url}/api/interview/${id}`,params, {headers: headers})
  }
}
