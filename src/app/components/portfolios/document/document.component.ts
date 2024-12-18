import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documents } from '../../../models/documents'; // Adjust the import path as necessary
import { DocumentsService } from '../../../services/documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit, OnDestroy {
  documents: Documents[] = [];
  document: Documents = new Documents(0, '', '', '', '', '', '', '', 0, 0, new Date(), new Date(), new Date(), '', 0, 0, 0, '', '', '', 0);
  selectedDocument: Documents | null = null;
  isModalOpen = false;
  isViewModalOpen = false;
  isEditMode = false;
  errorMessage = '';
  selectedPortfolioId: number | null = null;

  initialCosts: { motivo: string; valor: string; tipo: string }[] = [];
  finalCosts: { motivo: string; valor: string; tipo: string }[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const routeSubscription = this.route.paramMap.subscribe(params => {
      this.selectedPortfolioId = +params.get('id')!;
      this.loadDocuments();
    });
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    console.log('Component destroyed and resources cleaned up');
  }

  loadDocuments(): void {
    if (this.selectedPortfolioId !== null) {
      this.documentsService.getDocumentsByPortfolioId(this.selectedPortfolioId).subscribe({
        next: (data) => {
          this.documents = data;
          this.cdr.markForCheck();
        },
        error: (error) => console.error('Error fetching documents:', error)
      });
    } else {
      console.error('Portfolio ID not selected');
    }
  }

  addInitialCost(motivo: string, valor: string, tipo: string): void {
    if (tipo === 'porcentaje') {
      valor += '%';
    }
    this.initialCosts.push({ motivo, valor, tipo });
  }

  removeInitialCost(index: number): void {
    this.initialCosts.splice(index, 1);
  }

  addFinalCost(motivo: string, valor: string, tipo: string): void {
    if (tipo === 'porcentaje') {
      valor += '%';
    }
    this.finalCosts.push({ motivo, valor, tipo });
  }

  removeFinalCost(index: number): void {
    this.finalCosts.splice(index, 1);
  }

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
    this.resetForm();
  }

  openViewModal(document: Documents): void {
    this.selectedDocument = document;
    (window.document as Document).body.style.overflow = 'hidden';
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    document.body.style.overflow = '';
    this.selectedDocument = null;
  }

  addDocument(): void {
    if (!this.document.documentType || !this.document.financialInstitutionsName || !this.document.number ||
      !this.document.series || !this.document.issuerName || !this.document.issuerRuc || !this.document.currency ||
      !this.document.amount || !this.document.igv || !this.document.issueDate || !this.document.dueDate ||
      !this.document.discountDate || !this.document.paymentTerms || !this.document.nominalRate || !this.document.effectiveRate ||
      !this.document.status) {
      this.errorMessage = 'Por favor, rellene todos los campos obligatorios.';
      return;
    }

    if (this.selectedPortfolioId !== null) {
      this.document.portfolioId = this.selectedPortfolioId;
      if (!this.document.id) {
        this.documentsService.getMaxId().subscribe({
          next: (maxId) => {
            this.document.id = maxId + 1;
            this.saveDocument();
          },
          error: (error) => console.error('Error al obtener el ID máximo:', error)
        });
      } else {
        this.saveDocument();
      }
    } else {
      console.error('ID de cartera no seleccionada');
    }
  }

  formatCosts(costs: { motivo: string; valor: string }[]): string {
    const formattedCosts = costs.map(item => `${item.motivo}:${item.valor}`).join(', ');
    return `{${formattedCosts}}`;
  }

  saveDocument(): void {
    this.document.initialCosts = this.formatCosts(this.initialCosts);
    this.document.finalCosts = this.formatCosts(this.finalCosts);
    this.document.tcea = this.calculateTCEA();

    if (this.isEditMode) {
      this.documentsService.updateDocument(this.document).subscribe({
        next: (updatedDocument) => {
          const index = this.documents.findIndex(d => d.id === updatedDocument.id);
          if (index !== -1) {
            this.documents[index] = updatedDocument;
          }
          this.closeModal();
        },
        error: (error) => console.error('Error al actualizar el documento:', error)
      });
    } else {
      this.documentsService.addDocument(this.document).subscribe({
        next: (newDocument) => {
          this.documents.push(newDocument);
          this.closeModal();
        },
        error: (error) => console.error('Error al agregar documento:', error)
      });
    }
  }

  calculateTCEA(): number {
    const tasaNominal = this.document.nominalRate / 100;
    const monto = this.document.amount || 0;

    const fechaEmision = new Date(this.document.issueDate);
    const fechaVencimiento = new Date(this.document.dueDate);
    const fechaDescuento = new Date(this.document.discountDate);

    const dias = (fechaVencimiento.getTime() - fechaEmision.getTime()) / (1000 * 3600 * 24);
    const diasDescuento = (fechaDescuento.getTime() - fechaEmision.getTime()) / (1000 * 3600 * 24);

    if (dias <= 0 || monto <= 0) {
      console.error("Las fechas o el monto no son válidos");
      return 0;
    }

    const tcea = Math.pow(
      (1 + ((tasaNominal / monto)) / (1 - (diasDescuento / 360))),
      (360 / dias)
    ) - 1;

    return tcea * 100;
  }

  editDocument(id: number): void {
    const index = this.documents.findIndex(d => d.id === id);
    if (index !== -1) {
      this.document = { ...this.documents[index] };
      this.isEditMode = true;
      this.openModal();
      this.loadCostsForEditing(this.document);
    } else {
      console.error('Documento no encontrado');
    }
  }

  loadCostsForEditing(document: Documents): void {
    this.initialCosts = this.parseCosts(document.initialCosts);
    this.finalCosts = this.parseCosts(document.finalCosts);
  }

  parseCosts(costsString: string): { motivo: string; valor: string; tipo: string }[] {
    const costsArray: { motivo: string; valor: string; tipo: string }[] = [];
    const formattedCosts = costsString.replace(/[{}]/g, '').split(',').map(cost => cost.trim());

    for (const cost of formattedCosts) {
      const [motivo, valorTipo] = cost.split(':');
      if (valorTipo) {
        const [valor, tipo] = valorTipo.split('(');
        costsArray.push({
          motivo: motivo.trim(),
          valor: valor.trim(),
          tipo: tipo ? tipo.replace(')', '').trim() : ''
        });
      }
    }

    return costsArray;
  }

  toggleStatus(document: Documents): void {
    document.status = document.status === 'En Progreso' ? 'Completado' : 'En Progreso';

    this.documentsService.updateDocument(document).subscribe({
      next: (updatedDocument) => {
        document = updatedDocument;
      },
      error: (error) => {
        console.error('Error al actualizar el estado del documento:', error);
        document.status = document.status === 'En Progreso' ? 'Completado' : 'En Progreso';
      },
      complete: () => {
        console.log('Actualización del estado del documento completada.');
      }
    });
  }

  deleteDocument(id: number): void {
    this.documentsService.deleteDocument(id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== id);
      },
      error: (error) => console.error('Error deleting document:', error)
    });
  }

  resetForm(): void {
    this.document = new Documents(0, '', '', '', '', '', '', '', 0, 0, new Date(), new Date(), new Date(), '', 0, 0, 0, '', '', '', 0);
    this.isEditMode = false;
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/portfolios']);
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
