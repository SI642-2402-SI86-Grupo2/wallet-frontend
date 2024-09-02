import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documents } from '../models/documents';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  getDocumentsByPortfolioId(portfolioId: number): Observable<Documents[]> {
    return this.http.get<Documents[]>(`${this.apiUrl}?portfolio_id=${portfolioId}`);
  }

  getDocumentById(id: number): Observable<Documents> {
    return this.http.get<Documents>(`${this.apiUrl}/${id}`);
  }

  createDocuments(documents: Documents[]): Observable<Documents[]> {
    return this.http.post<Documents[]>(this.apiUrl, documents);
  }

  updateDocuments(documents: Documents[]): Observable<Documents[]> {
    return this.http.put<Documents[]>(this.apiUrl, documents);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
