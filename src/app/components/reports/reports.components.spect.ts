import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { FirebaseService } from '../../services/firebase.service';
import { StorageService } from '../../services/storage.service';
import { PortfoliosService } from '../../services/portfolios.service';
import { of } from 'rxjs';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let firebaseServiceMock: any;
  let portfoliosServiceMock: any;
  let storageServiceMock: any;

  beforeEach(async () => {
    // Mock de FirebaseService
    firebaseServiceMock = {
      getDocumentsByPortfolioId: jasmine.createSpy('getDocumentsByPortfolioId').and.callFake((id: string) =>
        of([{ documentType: 'Factura', financialInstitutionsName: 'Banco1', tcea: 5.5, status: 'Activo' }])
      )
    };

    // Mock de PortfoliosService
    portfoliosServiceMock = {
      getPortfoliosByUserId: jasmine.createSpy('getPortfoliosByUserId').and.returnValue(
        of([{ id: '1', portfolioName: 'Portfolio1', description: 'Description1', totalTcea: 5.5 }])
      )
    };

    // Mock de StorageService
    storageServiceMock = {
      getUserId: jasmine.createSpy('getUserId').and.returnValue('test-user-id')
    };

    // Configuración del módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: PortfoliosService, useValue: portfoliosServiceMock },
        { provide: StorageService, useValue: storageServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch portfolios and documents on loadAllData', async () => {
    await component.loadAllData();

    expect(storageServiceMock.getUserId).toHaveBeenCalled();
    expect(portfoliosServiceMock.getPortfoliosByUserId).toHaveBeenCalledWith('test-user-id');
    expect(firebaseServiceMock.getDocumentsByPortfolioId).toHaveBeenCalledWith('1');
    expect(component.portfolios.length).toBe(1);
    expect(component.portfolios[0].documents.length).toBe(1);
  });

  it('should generate report data correctly', () => {
    // Mock de datos
    component.portfolios = [
      {
        id: '1',
        portfolioName: 'Portfolio1',
        description: 'Description1',
        totalTcea: 5.5,
        documents: [
          { documentType: 'Factura', financialInstitutionsName: 'Banco1', tcea: 5.5, status: 'Activo' }
        ]
      }
    ];

    component.generateReport();

    expect(component.reportData.length).toBe(1);
    expect(component.reportData[0].portfolioName).toBe('Portfolio1');
    expect(component.reportData[0].documents[0].documentType).toBe('Factura');
  });

  it('should not generate PDF if no portfolios are selected', () => {
    spyOn(console, 'error');
    component.portfolios = [];
    component.generateSelectedPDF();
    expect(console.error).toHaveBeenCalledWith('Seleccione al menos un portafolio para generar el PDF.');
  });

  it('should generate PDF correctly when portfolios are selected', () => {
    spyOn(component, 'generateSelectedPDF');
    component.portfolios = [
      {
        id: '1',
        portfolioName: 'Portfolio1',
        description: 'Description1',
        totalTcea: 5.5,
        documents: [
          { documentType: 'Factura', financialInstitutionsName: 'Banco1', tcea: 5.5, status: 'Activo' }
        ],
        selected: true
      }
    ];
    component.generateSelectedPDF();
    expect(component.generateSelectedPDF).toHaveBeenCalled();
  });

  it('should display error if user is not authenticated', async () => {
    storageServiceMock.getUserId.and.returnValue(null);
    await component.loadAllData();
    expect(component.errorMessage).toBe('El usuario no está autenticado');
  });
});
