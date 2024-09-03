import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Documents } from '../models/documents';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  getDocumentsByPortfolioId(portfolioId: number): Observable<Documents[]> {
    return this.http.get<Documents[]>(`${this.apiUrl}?portfolios_id=${portfolioId}`);
  }

  addDocument(document: Documents): Observable<Documents> {
    return this.http.post<Documents>(this.apiUrl, document);
  }

  updateDocument(document: Documents): Observable<Documents> {
    return this.http.put<Documents>(`${this.apiUrl}/${document.id}`, document);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMaxId(): Observable<number> {
    return this.http.get<Documents[]>(this.apiUrl).pipe(
      map((documents: Documents[]) => Math.max(...documents.map((p: Documents) => p.id || 0), 0))
    );
  }

}
