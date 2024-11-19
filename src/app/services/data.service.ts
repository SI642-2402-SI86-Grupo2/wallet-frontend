import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  // Método para obtener los portafolios
  getPortfolios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolios`);
  }

  // Método para obtener los documentos
  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }
}
