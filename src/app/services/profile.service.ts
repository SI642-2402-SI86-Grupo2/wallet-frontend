import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/v1/profile`;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfileByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${profile.userId}`, profile, { headers: this.getHeaders() });
  }

  createProfile(profile: any): Observable<any> {
    const createProfileUrl = `${this.apiUrl}/profile`;
    return this.http.post<any>(createProfileUrl, profile, { headers: this.getHeaders() });
  }
}