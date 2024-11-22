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
        totalTcea: portfolio.totalTcea ?? 0, // Mantén el valor si ya existe
        selected: false,
      }));

      for (const portfolio of this.portfolios) {
        const documents = await firstValueFrom(this.firebaseService.getDocumentsByPortfolioId(portfolio.id));
        portfolio.documents = documents;
        this.documents.push(...documents); // Add documents to the main documents array

        // Depuración
        console.log(`Documentos para el portafolio ${portfolio.portfolioName || 'Sin nombre'}:`, documents);

        // Calcula el total TCEA (si aplica)
        portfolio.totalTcea = documents.reduce(
          (sum: number, doc: any) => sum + (doc.financialDetails?.tcea ?? 0),
          0
        );

        console.log(`Total TCEA para ${portfolio.portfolioName || 'Sin nombre'}:`, portfolio.totalTcea);
      }
      console.log('Estructura de documento:', this.documents);
      console.log('Documentos de cada portafolio:', this.documents);
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

    this.reportData = this.portfolios.map((portfolio) => {
      if (!portfolio.documents || portfolio.documents.length === 0) {
        console.log(`No documents for portfolio ${portfolio.portfolioName}`);
      }
      return {
        portfolioName: portfolio.portfolioName || 'Portafolio sin nombre',
        portfolioDescription: portfolio.description || 'Sin descripción',
        totalTcea: portfolio.totalTcea?.toFixed(2) || '0.00',
        documents: portfolio.documents?.map((doc: any) => ({
          title: doc.title || 'Sin título',
          description: doc.description || 'Sin descripción',
          tcea: doc.tcea?.toFixed(2) || '0.00',
          documentType: doc.documentType,
          financialInstitutionsName: doc.financialInstitutionsName,
          status: doc.status,
        })),
      };
    });

    console.log('Portafolios obtenidos:', this.portfolios);
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
    const invoiceNumber = Math.floor(100000000 + Math.random() * 900000000); // Generar número de factura aleatorio

    let yPosition = 40; // Posición inicial
    const lineSpacing = 10; // Espaciado entre líneas

    // Encabezado
    const addHeader = () => {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Reporte de Portafolios', 20, 20);
      doc.setFontSize(10);
      doc.text(`Número de Factura: #${invoiceNumber}`, 20, 30);
      doc.text(`Fecha: ${date}`, 190, 30, { align: 'right' });
      doc.line(20, 35, 190, 35); // Línea divisoria debajo del encabezado
    };

    // Tabla principal
    const addTableHeader = () => {
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Nombre del Portafolio', 20, yPosition);
      doc.text('Descripción', 100, yPosition);
      doc.text('TCEA', 180, yPosition, { align: 'right' });
      yPosition += lineSpacing;
      doc.line(20, yPosition, 190, yPosition); // Línea divisoria
    };

    const addTableRow = (portfolio: any) => {
      const tcea = portfolio.totalTcea || 0;
      doc.text(portfolio.portfolioName, 20, yPosition);
      doc.text(portfolio.description || 'Sin descripción', 100, yPosition);
      doc.text(`${tcea.toFixed(2)}%`, 180, yPosition, { align: 'right' });
      yPosition += lineSpacing;
      doc.line(20, yPosition, 190, yPosition); // Línea divisoria entre filas
    };


    // Pie de página
    const addFooter = () => {
      yPosition += lineSpacing * 2; // Espaciado antes del pie de página
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('¡Gracias por usar nuestro servicio!', 20, yPosition);
      yPosition += lineSpacing;
      doc.text('Si tiene alguna consulta, por favor contáctese con soporte.', 20, yPosition);
    };

    // Generar el PDF
    addHeader();
    yPosition += 10; // Ajustar después del encabezado
    addTableHeader();

    selectedPortfolios.forEach((portfolio) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 40;
        addHeader();
        yPosition += 10;
        addTableHeader();
      }
      addTableRow(portfolio);
    });

    addFooter();

    // Descargar el PDF
    doc.save('reporte-portafolios.pdf');
  }
}
