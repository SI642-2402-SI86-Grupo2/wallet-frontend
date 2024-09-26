import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Documents } from '../../models/documents';
import { DocumentsService } from '../../services/documents.service';
import { Portfolios } from '../../models/portfolios';
import { PortfoliosService } from '../../services/portfolios.service';

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
  orderByBank: boolean = false;  // Checkbox "Ordenar por entidad bancaria" activado por defecto

  constructor(
    private documentsService: DocumentsService,
    private portfoliosService: PortfoliosService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.loadPortfoliosAndDocuments();
  }

  loadPortfoliosAndDocuments(): void {
    this.portfoliosService.getPortfoliosByUserId(1)  // Reemplazar con el userId real
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

  populateFinancialInstitutions(): void {
    this.financialInstitutions = [...new Set(this.documents.map(doc => doc.financial_institutions_name))];
  }

  filterDocuments(): void {
    // Filtrar los documentos por entidad financiera y estado (In Progress)
    this.filteredDocuments = this.documents.filter(document => {
      const matchesInstitution = !this.selectedFinancialInstitution || document.financial_institutions_name === this.selectedFinancialInstitution;
      const matchesPending = !this.showPendingOnly || document.status === 'En Progreso';
      return matchesInstitution && matchesPending;
    });

    if (this.orderByBank) {
      // Ordenar por entidad bancaria y luego por fecha de vencimiento si el checkbox está activo
      this.filteredDocuments.sort((a, b) => {
        if (a.financial_institutions_name === b.financial_institutions_name) {
          // Si las entidades son iguales, ordenar por fecha de vencimiento
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        return a.financial_institutions_name.localeCompare(b.financial_institutions_name);
      });
    } else {
      // Ordenar solo por fecha de vencimiento si el checkbox de entidad bancaria no está activo
      this.filteredDocuments.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    }
  }



  onFinancialInstitutionChange(event: any): void {
    this.selectedFinancialInstitution = event.target.value;
    this.filterDocuments();
  }

  onPendingChange(event: any): void {
    this.showPendingOnly = event.target.checked;
    this.filterDocuments();
  }

  onOrderByBankChange(event: any): void {
    this.orderByBank = event.target.checked;
    this.filterDocuments(); // Aplicar filtros y ordenar documentos
  }


  selectPortfolio(portfolioId: number): void {
    this.router.navigate([`/portfolios/${portfolioId}/documents`]);
  }
}
