import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@angular/fire/compat/firestore';  // Asegúrate de que el path sea correcto
import { saveAs } from 'file-saver';  // Asegúrate de tener el paquete file-saver instalado
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  documents: any[] = [];
  portfolios: any[] = [];
  reportData: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Cargar los documentos y portafolios al iniciar
    this.loadDocuments();
    this.loadPortfolios();
  }

  // Cargar documentos desde Firebase
  loadDocuments(): void {
    this.firebaseService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data;
        this.generateReport();
      },
      error: (error) => console.error('Error loading documents:', error)
    });
  }

  // Cargar portafolios desde Firebase
  loadPortfolios(): void {
    this.firebaseService.getPortfolios().subscribe({
      next: (data) => {
        this.portfolios = data;
        this.generateReport();
      },
      error: (error) => console.error('Error loading portfolios:', error)
    });
  }

  // Generar el reporte uniendo documentos y portafolios
  generateReport(): void {
    if (this.documents.length && this.portfolios.length) {
      this.reportData = this.documents.map((doc) => {
        const portfolio = this.portfolios.find(p => p.id === doc.portfolioId);
        return {
          documentName: doc.name,
          documentType: doc.type,
          portfolioName: portfolio ? portfolio.name : 'Unknown',
          portfolioDescription: portfolio ? portfolio.description : 'No description'
        };
      });
    }
  }

  // Guardar el reporte en Firebase
  async saveReportToFirebase(): Promise<void> {
    const report = {
      data: this.reportData,
      generatedAt: new Date().toISOString()
    };

    try {
      await this.firebaseService.saveReport(report);
      console.log('Report saved to Firebase');
    } catch (error) {
      console.error('Error saving report to Firebase:', error);
    }
  }

  // Descargar el reporte como archivo JSON
  downloadReport(): void {
    const blob = new Blob([JSON.stringify(this.reportData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, 'report.json');
  }
}
