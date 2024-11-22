import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Portfolios } from '../../models/portfolios';
import { PortfoliosService } from '../../services/portfolios.service';
import { StorageService } from '../../services/storage.service';
import { DocumentsService } from '../../services/documents.service';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver'; // Para descargar JSON
import { jsPDF } from 'jspdf'; // Para generar PDFs

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfoliosComponent implements OnInit, OnDestroy {
  portfolios: Portfolios[] = []; // Lista de portafolios
  isModalOpen: boolean = false; // Estado del modal
  isEditMode: boolean = false; // Modo edición
  portfolio: Portfolios = new Portfolios(0, '', '', new Date(), 0, 0); // Portafolio actual
  errorMessage: string = ''; // Mensaje de error
  private subscriptions: Subscription[] = []; // Suscripciones activas

  constructor(
    private portfoliosService: PortfoliosService,
    private storageService: StorageService,
    private documentsService: DocumentsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPortfolios(); // Cargar los portafolios al inicializar
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Component destroyed and resources cleaned up');
  }

  /**
   * Carga los portafolios del usuario y calcula el TCEA promedio.
   */
  loadPortfolios(): void {
    const userId = this.storageService.getUserId();
    if (userId) {
      const portfoliosSubscription = this.portfoliosService
        .getPortfoliosByUserId(userId)
        .subscribe({
          next: (data) => {
            this.portfolios = data;
            this.portfolios.forEach((portfolio) => {
              this.calculateAverageTCEA(portfolio);
            });
            this.cdr.markForCheck(); // Forzar detección de cambios
          },
          error: (error) => console.error('Error fetching portfolios:', error),
        });
      this.subscriptions.push(portfoliosSubscription);
    } else {
      console.error('User ID not found in storage');
    }
  }

  /**
   * Calcula el TCEA promedio de un portafolio.
   * @param portfolio - Portafolio al que se le calcula el TCEA.
   * @returns Promise con el TCEA promedio.
   */
  calculateAverageTCEA(portfolio: Portfolios): Promise<number> {
    return new Promise((resolve, reject) => {
      this.documentsService.getDocumentsByPortfolioId(portfolio.id).subscribe({
        next: (documents) => {
          if (documents.length > 0) {
            const totalTCEA = documents.reduce((sum, doc) => sum + doc.tcea, 0);
            portfolio.totalTcea = totalTCEA / documents.length;
            resolve(portfolio.totalTcea);
          } else {
            portfolio.totalTcea = 0;
            resolve(0);
          }
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
          reject(error);
        },
      });
    });
  }

  /**
   * Abre el modal para agregar/editar un portafolio.
   */
  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Evitar desplazamiento
    this.errorMessage = '';
  }

  /**
   * Cierra el modal y reinicia el formulario.
   */
  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = ''; // Restaurar desplazamiento
    this.resetForm();
  }

  /**
   * Agrega o actualiza un portafolio.
   */
  addPortfolio(): void {
    if (
      !this.portfolio.portfolioName ||
      !this.portfolio.description ||
      !this.portfolio.discountDate
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const userId = this.storageService.getUserId();
    if (userId) {
      this.portfolio.profileId = userId;
      if (!this.portfolio.id) {
        this.portfoliosService.getMaxId().subscribe({
          next: (maxId) => {
            this.portfolio.id = maxId + 1;
            this.savePortfolio();
          },
          error: (error) => console.error('Error fetching max ID:', error),
        });
      } else {
        this.savePortfolio();
      }
    } else {
      console.error('User ID not found in storage');
    }
  }

  /**
   * Guarda el portafolio (nuevo o editado).
   */
  savePortfolio(): void {
    this.calculateAverageTCEA(this.portfolio)
      .then((averageTCEA) => {
        this.portfolio.totalTcea = averageTCEA;
        if (this.isEditMode) {
          this.portfoliosService.updatePortfolio(this.portfolio).subscribe({
            next: (updatedPortfolio) => {
              const index = this.portfolios.findIndex(
                (d) => d.id === updatedPortfolio.id
              );
              this.portfolios[index] = updatedPortfolio;
              this.closeModal();
            },
            error: (error) =>
              console.error('Error updating portfolio:', error),
          });
        } else {
          this.portfoliosService.addPortfolio(this.portfolio).subscribe({
            next: (newPortfolio) => {
              this.portfolios.push(newPortfolio);
              this.closeModal();
              this.loadPortfolios(); // Recargar los portafolios
            },
            error: (error) =>
              console.error('Error adding portfolio:', error),
          });
        }
      })
      .catch((error) => {
        console.error('Error calculating average TCEA:', error);
      });
  }

  /**
   * Edita un portafolio existente.
   * @param portfolioId - ID del portafolio a editar.
   */
  editPortfolio(portfolioId: number): void {
    const index = this.portfolios.findIndex((p) => p.id === portfolioId);
    if (index !== -1) {
      this.portfolio = { ...this.portfolios[index] };
      this.isEditMode = true;
      this.openModal();
    } else {
      console.error('Portfolio not found');
    }
  }

  /**
   * Elimina un portafolio.
   * @param id - ID del portafolio a eliminar.
   */
  deletePortfolio(id: number): void {
    this.portfoliosService.deletePortfolio(id).subscribe({
      next: () => {
        this.portfolios = this.portfolios.filter(
          (portfolio) => portfolio.id !== id
        );
      },
      error: (error) => console.error('Error deleting portfolio:', error),
    });
  }

  /**
   * Reinicia el formulario del modal.
   */
  resetForm(): void {
    this.portfolio = new Portfolios(0, '', '', new Date(), 0, 0);
    this.isEditMode = false;
    this.errorMessage = '';
  }

  /**
   * Navega a los documentos del portafolio seleccionado.
   * @param portfolioId - ID del portafolio.
   */
  selectPortfolio(portfolioId: number): void {
    this.router.navigate([`/portfolios/${portfolioId}/documents`]);
  }

  /**
   * Función de seguimiento para el *ngFor.
   * @param index - Índice del elemento.
   * @param item - Elemento actual.
   * @returns ID del portafolio.
   */
  trackByFn(index: number, item: Portfolios): number {
    return item.id;
  }

  /**
   * Prepara los datos de todas las carteras para ser exportados.
   */
  preparePortfoliosData(): any[] {
    return this.portfolios.map(portfolio => ({
      name: portfolio.portfolioName,
      description: portfolio.description,
      discountDate: portfolio.discountDate,
      totalTcea: portfolio.totalTcea,
    }));
  }

  /**
   * Genera un archivo JSON con los datos de todas las carteras.
   */
  downloadPortfoliosAsJSON(): void {
    const data = this.preparePortfoliosData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'portfolios.json');
    console.log('Portfolios data downloaded as JSON.');
  }

  /**
   * Genera un archivo PDF con los datos de todas las carteras.
   */
  generatePortfoliosPDF(): void {
    const data = this.preparePortfoliosData();
    const doc = new jsPDF();
    doc.text('Portfolio Report', 10, 10);

    let yPosition = 20;
    data.forEach((portfolio, index) => {
      doc.text(`${index + 1}. Name: ${portfolio.name}`, 10, yPosition);
      doc.text(`   Description: ${portfolio.description}`, 10, yPosition + 10);
      doc.text(`   Discount Date: ${new Date(portfolio.discountDate).toLocaleDateString()}`, 10, yPosition + 20);
      doc.text(`   Total TCEA: ${portfolio.totalTcea.toFixed(2)}%`, 10, yPosition + 30);

      yPosition += 40;

      portfolio.documents.forEach((docItem: any, docIndex: number) => {
        doc.text(`      - Document ${docIndex + 1}: ${docItem.title}`, 10, yPosition);
        doc.text(`        Description: ${docItem.description}`, 10, yPosition + 10);
        doc.text(`        TCEA: ${docItem.tcea.toFixed(2)}%`, 10, yPosition + 20);

        yPosition += 30;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    });

    doc.save('portfolios.pdf');
    console.log('Portfolios data downloaded as PDF.');
  }
}
