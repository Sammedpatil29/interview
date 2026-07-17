import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; // Observable is used but not imported

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
url = environment.apiUrl;
token = ''
  constructor(private http: HttpClient) {
    this.token = sessionStorage.getItem('token') || ''
   }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  createInterview(params: any): Observable<any> {
    return this.http.post(`${this.url}/api/interview/`, params)
  }

  getInterviews(): Observable<any> {
    return this.http.get(`${this.url}/api/interview/`, { headers: this.getAuthHeaders() })
  }

  getInterviewById(id: string): Observable<any> {
    return this.http.get(`${this.url}/api/interview/${id}`, { headers: this.getAuthHeaders() })
  }

  getInterviewers(): Observable<any> {
    return this.http.get(`${this.url}/api/interviewer/`, { headers: this.getAuthHeaders() })
  }
  
  updateInterview(id: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/api/interview/${id}`, params, { headers: this.getAuthHeaders() })
  }

  pendingTransactionRequests(): Observable<any> {
    return this.http.get(`${this.url}/api/interview/pending-approvals`, { headers: this.getAuthHeaders() })
  }

  approveTransaction(id: string): Observable<any> {
    // The second argument for a PUT request is the body.
    // Since there is no body for this request, we pass an empty object {}.
    return this.http.put(`${this.url}/api/interview/${id}/approve-share`, {}, { headers: this.getAuthHeaders() })
  }

  getTransactions(){
    return this.http.get(`${this.url}/api/interviewer/wallet`, { headers: this.getAuthHeaders() })
  }

  getUpi(){
    return this.http.get(`${this.url}/api/interviewer/upi`, { headers: this.getAuthHeaders() })
  }

  withdraw(params:any){
    return this.http.post(`${this.url}/api/payout`, params, { headers: this.getAuthHeaders() })
  }

  getPayouts(){
    return this.http.get(`${this.url}/api/payout`, { headers: this.getAuthHeaders() })
  }

  confirmPayout(id:any,params:any){
    return this.http.put(`${this.url}/api/payout/${id}`, params, { headers: this.getAuthHeaders() })
  }

  getHrList(){
    return this.http.get(`${this.url}/api/hr`, { headers: this.getAuthHeaders() })
  }
}
