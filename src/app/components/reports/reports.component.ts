import { Component, OnInit } from '@angular/core';
import { PortfoliosService } from '../../services/portfolios.service';
import { FirebaseService } from '../../services/firebase.service';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  documents: any[] = [];
  portfolios: any[] = [];
  reportData: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private portfoliosService: PortfoliosService,
    private firebaseService: FirebaseService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  async loadAllData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Obteniendo portafolios y documentos relacionados...');
      const userId = this.storageService.getUserId();

      if (!userId) {
        this.errorMessage = 'El usuario no está autenticado';
        return;
      }

      const portfolios = await firstValueFrom(this.portfoliosService.getPortfoliosByUserId(userId));
      this.portfolios = portfolios.map((portfolio) => ({
        ...portfolio,
        selected: false,
      }));

      for (const portfolio of this.portfolios) {
        const documents = await firstValueFrom(this.firebaseService.getDocumentsByPortfolioId(portfolio.id));
        portfolio.documents = documents;
      }

      console.log('Datos cargados:', this.portfolios);
      this.generateReport();
    } catch (error) {
      this.errorMessage = 'Error al cargar los datos. Por favor, intente de nuevo.';
      console.error('Error al obtener datos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  generateReport(): void {
    if (this.portfolios.length === 0) {
      this.errorMessage = 'No hay datos disponibles para el reporte.';
      return;
    }

    this.reportData = this.portfolios.map((portfolio) => ({
      portfolioName: portfolio.portfolioName || 'Portafolio sin nombre',
      portfolioDescription: portfolio.description || 'Sin descripción',
      totalTcea: portfolio.totalTcea || 0,
      documents: portfolio.documents?.map((doc: any) => ({
        title: doc.title || 'Sin título',
        description: doc.description || 'Sin descripción',
        tcea: doc.tcea || 0,
        documentType: doc.documentType,
        financialInstitutionsName: doc.financialInstitutionsName,
        status: doc.status,
      })),
    }));

    console.log('Datos del reporte generados:', this.reportData);
  }

  downloadSelectedPortfolios(): void {
    const selectedPortfolios = this.portfolios.filter((portfolio) => portfolio.selected);

    if (selectedPortfolios.length === 0) {
      this.errorMessage = 'Seleccione al menos un portafolio para descargar.';
      return;
    }

    const blob = new Blob([JSON.stringify(selectedPortfolios, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'selected-portfolios.json');
    console.log('Portafolios seleccionados descargados:', selectedPortfolios);
  }

  generateSelectedPDF(): void {
    const selectedPortfolios = this.portfolios.filter((portfolio) => portfolio.selected);

    if (selectedPortfolios.length === 0) {
      this.errorMessage = 'Seleccione al menos un portafolio para generar el PDF.';
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const invoiceNumber = Math.floor(100000000 + Math.random() * 900000000).toString(); // Generar número de factura aleatorio

    let yPosition = 40; // Posición inicial
    const lineSpacing = 10; // Espaciado entre líneas

    // Función para añadir encabezado
    const addHeader = (doc: jsPDF, date: string, invoiceNumber: string) => {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Reporte de Portafolios', 105, 20, { align: 'center' }); // Centrado

      doc.setFontSize(10);
      doc.text(`Número de Factura: #${invoiceNumber}`, 20, 30); // Número de factura
      doc.text(`Fecha: ${date}`, 190, 30, { align: 'right' }); // Fecha
      doc.line(20, 35, 190, 35); // Línea divisoria
    };

    // Función para añadir encabezado de tabla
    const addTableHeader = () => {
      yPosition += 10; // Espacio después del encabezado
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Nombre del Portafolio', 20, yPosition);
      doc.text('Descripción', 100, yPosition);
      doc.text('TCEA', 180, yPosition, { align: 'right' });
      yPosition += lineSpacing;
      doc.line(20, yPosition, 190, yPosition); // Línea divisoria debajo del encabezado
    };

    // Función para añadir filas de la tabla
    const addTableRow = (portfolio: any) => {
      doc.setFont('Helvetica', 'normal');
      yPosition += lineSpacing - 2; // Reducir el espaciado entre filas

      // Validar valores
      const portfolioName = portfolio.portfolioName || 'N/A';
      const description = portfolio.description || 'Sin descripción';
      const totalTcea = isNaN(portfolio.totalTcea) ? '0.00' : portfolio.totalTcea.toFixed(2); // Validar que sea número

      doc.text(portfolioName, 20, yPosition);
      doc.text(description, 100, yPosition);
      doc.text(`${totalTcea}%`, 180, yPosition, { align: 'right' });

      doc.line(20, yPosition + 2, 190, yPosition + 2); // Línea divisoria entre filas
    };

    // Función para añadir pie de página
    const addFooter = () => {
      yPosition += lineSpacing * 2; // Espaciado antes del pie de página
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('¡Gracias por usar nuestro servicio!', 105, yPosition, { align: 'center' });
      yPosition += lineSpacing;
      doc.text('Si tiene alguna consulta, por favor contáctese con soporte.', 105, yPosition, { align: 'center' });
    };

    // Generar el PDF
    addHeader(doc, date, invoiceNumber);
    addTableHeader();

    selectedPortfolios.forEach((portfolio) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 40; // Reiniciar posición para la nueva página
        addHeader(doc, date, invoiceNumber);
        addTableHeader();
      }
      addTableRow(portfolio);
    });

    addFooter();

    // Descargar el PDF
    doc.save('reporte-portafolios-mejorado.pdf');
  }
}
