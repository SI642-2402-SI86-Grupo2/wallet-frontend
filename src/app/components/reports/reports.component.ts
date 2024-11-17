import {Component, NgIterable, OnInit} from '@angular/core';
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
  report: (NgIterable<unknown> & NgIterable<any>) | undefined | null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.dataService.getPortfolios().subscribe((data) => {
      this.portfolios = data;
    });
  }

  generatePDF(): void {
    const doc = new jsPDF();

    // Título del reporte
    doc.text('Reporte de Portafolios', 10, 10);

    // Columnas y filas para la tabla
    const columns = ['ID', 'Nombre', 'Descripción', 'TCEA Total', 'Fecha Descuento'];
    const rows = this.portfolios.map((portfolio) => [
      portfolio.id,
      portfolio.portfolio_name,
      portfolio.description,
      `${portfolio.total_tcea.toFixed(2)}%`,
      portfolio.discount_date,
    ]);

    // Generar la tabla
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Guardar el archivo PDF
    doc.save('portafolios.pdf');
  }

  exportToPDF() {

  }
}
