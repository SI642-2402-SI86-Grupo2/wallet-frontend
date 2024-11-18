
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    if (this.report.length === 0) {
      alert('No hay datos para generar el reporte.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Reporte de Portafolios', 10, 10);

    const columns = ['Nombre del Portafolio', 'TCEA Consolidado', 'Número de Documentos'];
    const rows = this.report.map((item) => [
      item.Nombre,
      item['TCEA Consolidado'],
      item.Documentos,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      styles: {
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save('reportes.pdf');
  }
}
