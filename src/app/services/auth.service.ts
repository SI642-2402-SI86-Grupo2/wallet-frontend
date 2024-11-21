import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/authentication`;

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
}
