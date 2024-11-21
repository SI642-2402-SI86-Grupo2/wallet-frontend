import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Portfolios } from '../models/portfolios';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PortfoliosService {
  private apiUrl = `${environment.apiUrl}/api/v1/portfolio`;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPortfoliosByUserId(userId: number): Observable<Portfolios[]> {
    return this.http.get<Portfolios[]>(`${this.apiUrl}/profile/${userId}`, { headers: this.getHeaders() });
  }

  addPortfolio(portfolio: Portfolios): Observable<Portfolios> {
    return this.http.post<Portfolios>(this.apiUrl, portfolio, { headers: this.getHeaders() });
  }

  updatePortfolio(portfolio: Portfolios): Observable<Portfolios> {
    return this.http.put<Portfolios>(`${this.apiUrl}/${portfolio.id}`, portfolio, { headers: this.getHeaders() });
  }

  deletePortfolio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getMaxId(): Observable<number> {
    return this.http.get<Portfolios[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((portfolios: Portfolios[]) => Math.max(...portfolios.map((p: Portfolios) => p.id || 0), 0))
    );
  }

  getPortfoliosByDateRange(): Observable<Portfolios[]> {
    return this.http.get<Portfolios[]>(`${this.apiUrl}/date-range`, { headers: this.getHeaders() });
  }
}
