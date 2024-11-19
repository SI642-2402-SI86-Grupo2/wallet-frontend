import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Documents } from '../models/documents';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = `${environment.apiUrl}/document`;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDocumentsByPortfolioId(portfolioId: number): Observable<Documents[]> {
    return this.http.get<Documents[]>(`${this.apiUrl}/portfolio/${portfolioId}`, { headers: this.getHeaders() });
  }

  getDocumentById(documentId: number): Observable<Documents> {
    return this.http.get<Documents>(`${this.apiUrl}/${documentId}`, { headers: this.getHeaders() });
  }

  addDocument(document: Documents): Observable<Documents> {
    return this.http.post<Documents>(this.apiUrl, document, { headers: this.getHeaders() });
  }

  updateDocument(document: Documents): Observable<Documents> {
    return this.http.put<Documents>(`${this.apiUrl}/${document.id}`, document, { headers: this.getHeaders() });
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getMaxId(): Observable<number> {
    return this.http.get<Documents[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((documents: Documents[]) => Math.max(...documents.map((p: Documents) => p.id || 0), 0))
    );
  }
}
