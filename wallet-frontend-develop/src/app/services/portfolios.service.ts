import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Portfolios } from '../models/portfolios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfoliosService {
  private apiUrl = `${environment.apiUrl}/portfolios`;

  constructor(private http: HttpClient) { }

  getPortfoliosByUserId(userId: number): Observable<Portfolios[]> {
    return this.http.get<Portfolios[]>(`${this.apiUrl}?users_id=${userId}`);
  }

  addPortfolio(portfolio: Portfolios): Observable<Portfolios> {
    return this.http.post<Portfolios>(this.apiUrl, portfolio);
  }

  updatePortfolio(portfolio: Portfolios): Observable<Portfolios> {
    return this.http.put<Portfolios>(`${this.apiUrl}/${portfolio.id}`, portfolio);
  }

  deletePortfolio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMaxId(): Observable<number> {
    return this.http.get<Portfolios[]>(this.apiUrl).pipe(
      map((portfolios: Portfolios[]) => Math.max(...portfolios.map((p: Portfolios) => p.id || 0), 0))
    );
  }

}
