import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/v1/profile/profile`;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }
    console.log('Token:', token); // Log the token for debugging
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfileByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userId/${userId}`, { headers: this.getHeaders() });
  }

  updateProfile(profile: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/${profile.userId}`, profile, { headers });
  }

  createProfile(profile: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, profile, { headers: this.getHeaders() });
  }

  uploadProfilePhoto(profileId: number, payload: any): Observable<any> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.put<any>(`${this.apiUrl}/${profileId}/photo-update`, payload, { headers });
  }
}
