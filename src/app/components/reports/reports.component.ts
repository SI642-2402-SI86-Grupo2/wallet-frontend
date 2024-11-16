
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  portfolios: any[] = [];
  documents: any[] = [];
  report: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.dataService.getPortfolios().subscribe((portfolios: any[]) => {
      this.portfolios = portfolios;
      this.dataService.getDocuments().subscribe((documents: any[]) => {
        this.documents = documents;
        this.generateReport();
      });
    });
  }

  generateReport(): void {
    this.report = this.portfolios.map((portfolio) => {
      const relatedDocuments = this.documents.filter(
        (doc) => doc.portfolios_id === portfolio.id
      );
      const totalTCEA = relatedDocuments.reduce(
        (sum, doc) => sum + doc.tcea,
        0
      );

      return {
        Nombre: portfolio.portfolio_name,
        'TCEA Consolidado': `${totalTCEA.toFixed(2)}%`,
        Documentos: relatedDocuments.length,
      };
    });
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Título del reporte
    doc.text('Reporte de Portafolios', 10, 10);

    // Columnas y filas
    const columns = ['Nombre del Portafolio', 'TCEA Consolidado', 'Número de Documentos'];
    const rows = this.report.map((item) => [
      item.Nombre,
      item['TCEA Consolidado'],
      item.Documentos,
    ]);

    // Tabla
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Guardar el archivo PDF
    doc.save('reportes.pdf');
  }
}
