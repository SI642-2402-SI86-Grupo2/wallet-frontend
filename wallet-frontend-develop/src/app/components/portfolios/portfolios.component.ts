import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { Portfolios } from '../../models/portfolios';
import { PortfoliosService } from '../../services/portfolios.service';
import { StorageService } from '../../services/storage.service';
import { DocumentsService } from '../../services/documents.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent implements OnInit, OnDestroy {
  portfolios: Portfolios[] = [];
  isModalOpen = false;
  isEditMode = false;
  portfolio: Portfolios = new Portfolios(0, '', '', new Date(), 0, 0);
  errorMessage = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private portfoliosService: PortfoliosService,
    private storageService: StorageService,
    private documentsService: DocumentsService,  // Agregar DocumentsService
    private router: Router,
  private cdr: ChangeDetectorRef

) {}

  ngOnInit(): void {
    this.storageService.setTestUserId();
    this.loadPortfolios();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    console.log('Component destroyed and resources cleaned up');
  }

  loadPortfolios(): void {
    const userId = this.storageService.getUserId();
    if (userId !== null) {
      const portfoliosSubscription = this.portfoliosService.getPortfoliosByUserId(userId).subscribe({
        next: (data) => {
          this.portfolios = data;
          this.portfolios.forEach(portfolio => {
            this.calculateAverageTCEA(portfolio);
          });
          this.cdr.markForCheck();
        },
        error: (error) => console.error('Error fetching portfolios:', error)
      });
      this.subscriptions.push(portfoliosSubscription);
    } else {
      console.error('User ID not found in storage');
    }
  }

  calculateAverageTCEA(portfolio: Portfolios): Promise<number> {
    return new Promise((resolve, reject) => {
      this.documentsService.getDocumentsByPortfolioId(portfolio.id).subscribe({
        next: (documents) => {
          if (documents.length > 0) {
            const totalTCEA = documents.reduce((sum, doc) => sum + doc.tcea, 0);
            portfolio.total_tcea = totalTCEA / documents.length;
            resolve(portfolio.total_tcea);
          } else {
            portfolio.total_tcea = 0;
            resolve(0);
          }
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
          reject(error);
        }
      });
    });
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.errorMessage = '';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
    this.resetForm();
  }

  addPortfolio() {
    if (!this.portfolio.portfolio_name || !this.portfolio.description || !this.portfolio.discount_date /*|| !this.portfolio.total_tcea*/) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const userId = this.storageService.getUserId();
    if (userId !== null) {
      this.portfolio.users_id = userId;
      if (!this.portfolio.id) {
        this.portfoliosService.getMaxId().subscribe({
          next: (maxId) => {
            this.portfolio.id = maxId + 1;
            this.savePortfolio();
          },
          error: (error) => console.error('Error fetching max ID:', error)
        });
      } else {
        this.savePortfolio();
      }
    } else {
      console.error('User ID not found in storage');
    }
  }

  savePortfolio() {
    this.calculateAverageTCEA(this.portfolio).then((averageTCEA) => {
      this.portfolio.total_tcea = averageTCEA;
      if (this.isEditMode) {
        this.portfoliosService.updatePortfolio(this.portfolio).subscribe({
          next: (updatedPortfolio) => {
            const index = this.portfolios.findIndex(d => d.id === updatedPortfolio.id);
            this.portfolios[index] = updatedPortfolio;
            this.closeModal();
          },
          error: (error) => console.error('Error updating portfolio:', error)
        });
      } else {
        this.portfoliosService.addPortfolio(this.portfolio).subscribe({
          next: (newPortfolio) => {
            this.portfolios.push(newPortfolio);
            this.closeModal();
          },
          error: (error) => console.error('Error adding portfolio:', error)
        });
      }
    }).catch((error) => {
      console.error('Error calculating average TCEA:', error);
    });
  }

  editPortfolio(portfolio_id: number) {
    const index = this.portfolios.findIndex(p => p.id === portfolio_id);
    if (index !== -1) {
      this.portfolio = { ...this.portfolios[index] };

      this.isEditMode = true;
      this.openModal();
    } else {
      console.error('Portfolio not found');
    }
  }

  deletePortfolio(id: number) {
    this.portfoliosService.deletePortfolio(id).subscribe({
      next: () => {
        this.portfolios = this.portfolios.filter(portfolio => portfolio.id !== id);
      },
      error: (error) => console.error('Error deleting portfolio:', error)
    });
  }

  resetForm() {
    this.portfolio = new Portfolios(0, '', '', new Date(), 0, 0);
    this.isEditMode = false;
    this.errorMessage = '';
  }

  selectPortfolio(portfolioId: number) {
    this.router.navigate([`/portfolios/${portfolioId}/documents`]);
  }
  trackByFn(index: number, item: Portfolios): number {
    return item.id;
  }
}
