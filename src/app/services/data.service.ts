import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Este decorador asegura que el servicio esté disponible globalmente
})
export class DataService {
  private baseUrl = 'http://localhost:3000'; // URL base del JSON Server

  constructor(private http: HttpClient) {}

  getPortfolios() {
    return this.http.get<any[]>(`${this.baseUrl}/portfolios`);
  }

  getDocuments() {
    return this.http.get<any[]>(`${this.baseUrl}/documents`);
  }
}
