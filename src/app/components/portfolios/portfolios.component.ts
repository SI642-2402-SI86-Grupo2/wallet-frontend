import { Component, OnInit } from '@angular/core';
import { Portfolios } from '../../models/portfolios';
import { PortfoliosService } from '../../services/portfolios.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit {
  portfolios: Portfolios[] = [];
  isModalOpen = false;
  isEditMode = false;
  portfolio: Portfolios = new Portfolios(0, '', '', new Date(), 0, 0);
  selectedPortfolioIndex = -1;
  errorMessage = '';

  constructor(
    private portfoliosService: PortfoliosService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.storageService.setTestUserId();
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    const userId = this.storageService.getUserId();
    if (userId !== null) {
      this.portfoliosService.getPortfoliosByUserId(userId).subscribe({
        next: (data) => {
          this.portfolios = data;
        },
        error: (error) => console.error('Error fetching portfolios:', error)
      });
    } else {
      console.error('User ID not found in storage');
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.errorMessage = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  addPortfolio() {
    if (!this.portfolio.portfolio_name || !this.portfolio.description || !this.portfolio.discount_date || !this.portfolio.total_tcea) {
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
    if (this.isEditMode) {
      this.portfoliosService.updatePortfolio(this.portfolio).subscribe({
        next: (updatedPortfolio) => {
          this.portfolios[this.selectedPortfolioIndex] = updatedPortfolio;
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
  }

  editPortfolio(portfolio_id: number) {
    const index = this.portfolios.findIndex(p => p.id === portfolio_id);
    if (index !== -1) {
      this.portfolio = { ...this.portfolios[index] };
      this.selectedPortfolioIndex = index;
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
}
