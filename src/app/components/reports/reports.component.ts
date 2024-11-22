import { Component, OnInit } from '@angular/core';
import { PortfoliosService } from '../../services/portfolios.service';
import { DocumentsService } from '../../services/documents.service';
import { StorageService } from '../../services/storage.service';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  portfolios: any[] = []; // Lista de portafolios
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private portfoliosService: PortfoliosService,
    private documentsService: DocumentsService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  /**
   * Carga las carteras y sus documentos relacionados.
   */
  async loadPortfolios(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userId = this.storageService.getUserId();
      if (!userId) {
        this.errorMessage = 'El usuario no está autenticado';
        return;
      }

      const portfolios = await firstValueFrom(this.portfoliosService.getPortfoliosByUserId(userId));
      this.portfolios = await Promise.all(
        portfolios.map(async (portfolio) => {
          const documents = await firstValueFrom(this.documentsService.getDocumentsByPortfolioId(portfolio.id));
          return {
            ...portfolio,
            selected: false, // Para seleccionar carteras
            totalTcea: portfolio.totalTcea ?? 0, // Valor predeterminado
            documents: documents.map((doc: any) => ({
              ...doc,
              title: doc.title || 'Sin título',
              description: doc.description || 'Sin descripción',
              documentType: doc.documentType || 'N/A',
              financialInstitutionsName: doc.financialInstitutionsName || 'N/A',
              amount: doc.amount || 0,
              currency: doc.currency || 'PEN',
              tcea: doc.tcea != null ? doc.tcea.toFixed(2) : 'N/A'
            }))
          };
        })
      );
    } catch (error) {
      this.errorMessage = 'Error al cargar las carteras. Intente nuevamente.';
      console.error('Error al cargar portafolios:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Genera un PDF con todos los portafolios y sus documentos.
   */
  generatePortfoliosPDF(): void {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let yPosition = 20;
    const lineSpacing = 10;

    const addHeader = () => {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Reporte Completo de Carteras y Documentos', 20, yPosition);
      yPosition += lineSpacing;
      doc.setFontSize(10);
      doc.text(`Fecha: ${date}`, 190, yPosition, { align: 'right' });
      yPosition += lineSpacing;
      doc.line(20, yPosition, 190, yPosition); // Línea divisoria
      yPosition += lineSpacing;
    };

    const addPortfolioData = (portfolio: any) => {
      if (yPosition + 40 > 290) {
        doc.addPage();
        yPosition = 20;
        addHeader();
      }
      doc.setFont('Helvetica', 'bold');
      doc.text(`Cartera: ${portfolio.portfolioName || 'Sin nombre'}`, 20, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += lineSpacing;
      doc.text(`Descripción: ${portfolio.description || 'Sin descripción'}`, 20, yPosition);
      yPosition += lineSpacing;
      doc.text(`TCEA Promedio: ${portfolio.totalTcea.toFixed(2)}%`, 20, yPosition);
      yPosition += lineSpacing;

      if (portfolio.documents.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.text('Documentos Relacionados:', 20, yPosition);
        yPosition += lineSpacing;

        portfolio.documents.forEach((docItem: any, index: number) => {
          if (yPosition + 30 > 290) {
            doc.addPage();
            yPosition = 20;
            addHeader();
          }
          doc.setFont('Helvetica', 'normal');
          doc.text(`${index + 1}. Título: ${docItem.title}`, 20, yPosition);
          yPosition += lineSpacing;
          doc.text(`   Descripción: ${docItem.description}`, 20, yPosition);
          yPosition += lineSpacing;
          doc.text(`   Tipo: ${docItem.documentType}`, 20, yPosition);
          yPosition += lineSpacing;
          doc.text(`   Institución: ${docItem.financialInstitutionsName}`, 20, yPosition);
          yPosition += lineSpacing;
          doc.text(
            `   Monto: ${docItem.amount.toLocaleString('es-PE', {
              style: 'currency',
              currency: docItem.currency
            })}`,
            20,
            yPosition
          );
          yPosition += lineSpacing;
          doc.text(`   TCEA: ${docItem.tcea}%`, 20, yPosition);
          yPosition += lineSpacing;
        });
      } else {
        doc.text('No hay documentos asociados.', 20, yPosition);
        yPosition += lineSpacing;
      }
    };

    addHeader();
    this.portfolios.forEach((portfolio) => addPortfolioData(portfolio));

    doc.save('portfolios.pdf');
  }

  /**
   * Genera un PDF con los portafolios seleccionados y sus documentos.
   */
  generateSelectedPDF(): void {
    const selectedPortfolios = this.portfolios.filter((p) => p.selected);

    if (selectedPortfolios.length === 0) {
      this.errorMessage = 'Seleccione al menos un portafolio para generar el PDF.';
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let yPosition = 20;
    const lineSpacing = 10;

    const addHeader = () => {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Reporte de Portafolios Seleccionados', 20, yPosition);
      yPosition += lineSpacing;
      doc.setFontSize(10);
      doc.text(`Fecha: ${date}`, 190, yPosition, { align: 'right' });
      yPosition += lineSpacing;
      doc.line(20, yPosition, 190, yPosition); // Línea divisoria
      yPosition += lineSpacing;
    };

    const addPortfolioData = (portfolio: any) => {
      if (yPosition + 40 > 290) {
        doc.addPage();
        yPosition = 20;
        addHeader();
      }
      doc.setFont('Helvetica', 'bold');
      doc.text(`Cartera: ${portfolio.portfolioName || 'Sin nombre'}`, 20, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += lineSpacing;
      doc.text(`Descripción: ${portfolio.description || 'Sin descripción'}`, 20, yPosition);
      yPosition += lineSpacing;
      doc.text(`TCEA Promedio: ${portfolio.totalTcea.toFixed(2)}%`, 20, yPosition);
      yPosition += lineSpacing;

      if (portfolio.documents.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.text('Documentos Relacionados:', 20, yPosition);
        yPosition += lineSpacing;

        portfolio.documents.forEach((docItem: any, index: number) => {
          if (yPosition + 20 > 290) {
            doc.addPage();
            yPosition = 20;
            addHeader();
          }
          doc.setFont('Helvetica', 'normal');
          doc.text(`${index + 1}. Título: ${docItem.title}`, 20, yPosition); // Mostrar el título correcto
          yPosition += lineSpacing;
          doc.text(`   Descripción: ${docItem.description}`, 20, yPosition); // Mostrar descripción correcta
          yPosition += lineSpacing;
          doc.text(`   TCEA: ${docItem.tcea}%`, 20, yPosition); // Mostrar TCEA
          yPosition += lineSpacing;
        });
      } else {
        doc.text('No hay documentos asociados.', 20, yPosition);
        yPosition += lineSpacing;
      }
    };

    addHeader();
    selectedPortfolios.forEach((portfolio) => addPortfolioData(portfolio));

    doc.save('selected-portfolios.pdf');
  }

  /**
   * Descarga un archivo JSON con los portafolios seleccionados.
   */
  downloadSelectedPortfolios(): void {
    const selectedPortfolios = this.portfolios.filter((p) => p.selected);

    if (selectedPortfolios.length === 0) {
      this.errorMessage = 'Seleccione al menos un portafolio para descargar.';
      return;
    }

    const blob = new Blob([JSON.stringify(selectedPortfolios, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'selected-portfolios.json');
  }
}
