import { Component } from '@angular/core';
import { Portfolios } from '../../models/portfolios'; // Importa la clase Portfolio desde el archivo correspondiente

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent {
  portfolios: Portfolios[] = [];  // Lista de portafolios
  isModalOpen = false;
  isEditMode = false;  // Indica si se está editando un portafolio
  portfolio: Portfolios = new Portfolios('', '', '');  // Instancia de la clase Portfolio
  selectedPortfolioIndex = -1; // Índice del portafolio seleccionado para editar

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  addPortfolio() {
    if (this.isEditMode) {
      // Guardar los cambios en el portafolio editado
      this.portfolios[this.selectedPortfolioIndex] = new Portfolios(
        this.portfolio.name,
        this.portfolio.description,
        this.portfolio.tcea
      );
    } else {
      // Añadir un nuevo portafolio a la lista
      this.portfolios.push(
        new Portfolios(
          this.portfolio.name,
          this.portfolio.description,
          this.portfolio.tcea
        )
      );
    }
    this.closeModal();
  }

  editPortfolio(index: number) {
    this.portfolio = new Portfolios(
      this.portfolios[index].name,
      this.portfolios[index].description,
      this.portfolios[index].tcea
    );
    this.selectedPortfolioIndex = index;
    this.isEditMode = true;
    this.openModal();
  }

  deletePortfolio(index: number) {
    this.portfolios.splice(index, 1);
  }

  resetForm() {
    this.portfolio = new Portfolios('', '', '');
    this.isEditMode = false;
    this.selectedPortfolioIndex = -1;
  }
}
