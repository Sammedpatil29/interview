import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  // Add other properties from your JWT payload here
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<any | null>(this.getRoleFromToken());
  public role$ = this.roleSubject.asObservable();

  login(token: string): void {
    sessionStorage.setItem('token', token);
    this.updateRoleFromToken(token);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.roleSubject.next(null);
  }

  private updateRoleFromToken(token: string): void {
    const role = this.decodeToken(token);
    this.roleSubject.next(role);
  }

  private getRoleFromToken(): string | null {
    const token = sessionStorage.getItem('token');
    return token ? this.decodeToken(token) : null;
  }

  private decodeToken(token: string): any | null {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const res = {
        id: decodedToken['id'],
        role: decodedToken.role,
        name: decodedToken['name']
      }
      return res // Assumes the role is stored in a 'role' claim
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}