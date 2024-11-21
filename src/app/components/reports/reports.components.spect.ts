import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { FirebaseService } from '/@firebase/firestore/firebase.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;

  beforeEach(async () => {
    // Crear un mock del servicio FirebaseService
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', [
      'getDocuments',
      'getPortfolios',
      'saveReport'
    ]);

    // Simular datos de retorno para documentos y portafolios
    mockFirebaseService.getDocuments.and.returnValue(of([
      { id: 1, name: 'Documento 1', type: 'Tipo A', portfolioId: 101 },
      { id: 2, name: 'Documento 2', type: 'Tipo B', portfolioId: 102 }
    ]));

    mockFirebaseService.getPortfolios.and.returnValue(of([
      { id: 101, name: 'Portafolio 1', description: 'Descripción 1' },
      { id: 102, name: 'Portafolio 2', description: 'Descripción 2' }
    ]));

    mockFirebaseService.saveReport.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      providers: [{ provide: FirebaseService, useValue: mockFirebaseService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load documents and portfolios on init', () => {
    expect(component.documents.length).toBe(2);
    expect(component.portfolios.length).toBe(2);
    expect(component.reportData.length).toBe(2);
    expect(component.reportData).toEqual([
      {
        documentName: 'Documento 1',
        documentType: 'Tipo A',
        portfolioName: 'Portafolio 1',
        portfolioDescription: 'Descripción 1'
      },
      {
        documentName: 'Documento 2',
        documentType: 'Tipo B',
        portfolioName: 'Portafolio 2',
        portfolioDescription: 'Descripción 2'
      }
    ]);
  });

  it('should save report to Firebase', async () => {
    await component.saveReportToFirebase();
    expect(mockFirebaseService.saveReport).toHaveBeenCalledWith({
      data: component.reportData,
      generatedAt: jasmine.any(String)
    });
  });

  it('should download the report as a JSON file', () => {
    const saveAsSpy = spyOn(window, 'saveAs');
    component.downloadReport();

    expect(saveAsSpy).toHaveBeenCalled();
    const blobArg = saveAsSpy.calls.mostRecent().args[0] as Blob;
    expect(blobArg.type).toBe('application/json');
  });

  it('should render the report table', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent).toContain('Documento 1');
    expect(firstRowCells[1].nativeElement.textContent).toContain('Tipo A');
    expect(firstRowCells[2].nativeElement.textContent).toContain('Portafolio 1');
    expect(firstRowCells[3].nativeElement.textContent).toContain('Descripción 1');
  });
});
