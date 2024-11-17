import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';// Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  portfolios: any[] = [];
  documents: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit():void {
    this.loadData();
  }

  loadData() {
    this.dataService.getPortfolios().subscribe((portfolios) => {
      this.portfolios = portfolios;
    });

    this.dataService.getDocuments().subscribe((documents) => {
      this.documents = documents;
    });
  }
}
