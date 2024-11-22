import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Documents } from '../../models/documents';
import { DocumentsService } from '../../services/documents.service';
import { Portfolios } from '../../models/portfolios';
import { PortfoliosService } from '../../services/portfolios.service';
import { StorageService } from '../../services/storage.service'; // Importar StorageService

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  documents: Documents[] = [];
  filteredDocuments: Documents[] = [];
  portfolios: Portfolios[] = [];
  financialInstitutions: string[] = [];
  selectedFinancialInstitution: string = '';
  showPendingOnly: boolean = true;  // Checkbox "Pending" activado por defecto
  showFacturados: boolean = false;  // Checkbox "Facturados" desactivado por defecto
  orderByBank: boolean = false;  // Checkbox "Ordenar por entidad bancaria" activado por defecto
  userId: number | null = null;  // Variable para almacenar el userId

  constructor(
    private documentsService: DocumentsService,
    private portfoliosService: PortfoliosService,
    private router: Router,
    private storageService: StorageService, // Inyectar StorageService
  ) { }

  ngOnInit(): void {
    this.userId = this.storageService.getUserId();  // Obtener el userId dinámicamente
    if (this.userId !== null) {
      this.loadPortfoliosAndDocuments();
    } else {
      // Manejar el caso en que no se encuentra el userId
      console.error('User ID not found');
    }
  }
  
  loadPortfoliosAndDocuments(): void {
    if (this.userId !== null) {
      this.portfoliosService.getPortfoliosByUserId(this.userId)  // Usar el userId dinámico
        .subscribe(portfolios => {
          this.portfolios = portfolios;
          portfolios.forEach(portfolio => {
            this.documentsService.getDocumentsByPortfolioId(portfolio.id)
              .subscribe(docs => {
                this.documents = this.documents.concat(docs);
                this.filteredDocuments = this.documents;
                this.populateFinancialInstitutions();
                this.filterDocuments(); // Aplicar filtros al cargar
              });
          });
        });
    }
  }

  populateFinancialInstitutions(): void {
    this.financialInstitutions = [...new Set(this.documents.map(doc => doc.financialInstitutionsName))];
  }

  filterDocuments(): void {
    // Filtrar los documentos por entidad financiera y estado (In Progress)
    this.filteredDocuments = this.documents.filter(document => {
      const matchesInstitution = !this.selectedFinancialInstitution || document.financialInstitutionsName === this.selectedFinancialInstitution;
      const matchesPending = !this.showPendingOnly || document.status === 'En Progreso';
      return matchesInstitution && matchesPending;
    });

    if (this.orderByBank) {
      // Ordenar por entidad bancaria y luego por fecha de vencimiento si el checkbox está activo
      this.filteredDocuments.sort((a, b) => {
        if (a.financialInstitutionsName === b.financialInstitutionsName) {
          // Si las entidades son iguales, ordenar por fecha de vencimiento
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.financialInstitutionsName.localeCompare(b.financialInstitutionsName);
      });
    } else {
      // Ordenar solo por fecha de vencimiento si el checkbox de entidad bancaria no está activo
      this.filteredDocuments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
  }

  filterFacturados(): void {
    if (this.showFacturados) {
      this.filteredDocuments = this.documents.filter(doc => doc.status === 'Facturado');
    } else {
      this.filterDocuments(); // Aplicar el filtro general si el checkbox de facturados está desactivado
    }
  }

  onFinancialInstitutionChange(event: any): void {
    this.selectedFinancialInstitution = event.target.value;
    this.filterDocuments();
  }

  onPendingChange(event: any): void {
    this.showPendingOnly = event.target.checked;
    if (this.showPendingOnly) {
      this.showFacturados = false;  // Desactivar checkbox de Facturados
    }
    this.filterDocuments();
  }

  onFacturadosChange(event: any): void {
    this.showFacturados = event.target.checked;
    if (this.showFacturados) {
      this.showPendingOnly = false;  // Desactivar checkbox de Pendientes
    }
    this.filterFacturados();
  }

  onOrderByBankChange(event: any): void {
    this.orderByBank = event.target.checked;
    this.filterDocuments(); // Aplicar filtros y ordenar documentos
  }

  selectPortfolio(portfolioId: number): void {
    this.router.navigate([`/portfolios/${portfolioId}/documents`]);
  }
}