import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://wallet-company-409716454006.us-central1.run.app/api/v1/authentication';
  private isSignedInSubject = new BehaviorSubject<boolean>(false); // Observable for auth status
  isSignedIn = this.isSignedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, { email, password });
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-in`, { email, password });
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isSignedInSubject.next(false);
      return new Observable((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.http.post<boolean>(`${this.apiUrl}/validate-token`, { token });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isSignedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isSignedInSubject.next(false);
  }
}
