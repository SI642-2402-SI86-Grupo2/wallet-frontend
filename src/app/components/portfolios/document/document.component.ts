import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documents } from '../../../models/documents'; // Adjust the import path as necessary
import { DocumentsService } from '../../../services/documents.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  documents: Documents[] = [];
  document: Documents = new Documents(0, '', '', '', '', '', '', '', 0, 0, new Date(), new Date(), new Date(), '', 0, 0, 0, 0, '', 0);
  selectedDocument: Documents | null = null;
  isModalOpen = false;
  isViewModalOpen = false;
  isEditMode = false;
  errorMessage = '';
  selectedPortfolioId: number | null = null;

  constructor(
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedPortfolioId = +params.get('id')!;
      this.loadDocuments();
    });
  }

  loadDocuments(): void {
    if (this.selectedPortfolioId !== null) {
      this.documentsService.getDocumentsByPortfolioId(this.selectedPortfolioId).subscribe({
        next: (data) => {
          this.documents = data;
        },
        error: (error) => console.error('Error fetching documents:', error)
      });
    } else {
      console.error('Portfolio ID not selected');
    }
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

  openViewModal(documents: Documents) {
    this.selectedDocument = documents;
    document.body.style.overflow = 'hidden';
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    document.body.style.overflow = '';
    this.selectedDocument = null;
  }

  addDocument() {
      if (!this.document.document_type || !this.document.financial_institutions_name || !this.document.number ||
        !this.document.series || !this.document.issuer_name || !this.document.issuer_ruc || !this.document.currecy ||
        !this.document.amount || !this.document.igv || !this.document.issue_date || !this.document.due_date ||
        !this.document.discount_date || !this.document.payment_terms || !this.document.nominal_rate || !this.document.effective_rate ||
        /*!this.document.tcea ||*/ !this.document.commission || !this.document.status) {
        this.errorMessage = 'Please fill in all required fields.';
        return;
      }

      if (this.selectedPortfolioId !== null) {
        this.document.portfolios_id = this.selectedPortfolioId;
        if (!this.document.id) {
          this.documentsService.getMaxId().subscribe({
            next: (maxId) => {
              this.document.id = maxId + 1;
              this.saveDocument();
            },
            error: (error) => console.error('Error fetching max ID:', error)
          });
        } else {
          this.saveDocument();
        }
      } else {
        console.error('Portfolio ID not selected');
      }
    }


  saveDocument() {

    // Recalcular el TCEA antes de guardar los cambios
    this.document.tcea = this.calculateTCEA();

    if (this.isEditMode) {
      // Si estamos editando, actualizamos el documento
      this.documentsService.updateDocument(this.document).subscribe({
        next: (updatedDocument) => {
          const index = this.documents.findIndex(d => d.id === updatedDocument.id);
          if (index !== -1) {
            this.documents[index] = updatedDocument;
          }
          this.closeModal();
        },
        error: (error) => console.error('Error updating document:', error)
      });
    } else {
      // Si estamos creando uno nuevo, lo añadimos
      this.documentsService.addDocument(this.document).subscribe({
        next: (newDocument) => {
          this.documents.push(newDocument);
          this.closeModal();
        },
        error: (error) => console.error('Error adding document:', error)
      });
    }
  }

  // Función para calcular la TCEA
  calculateTCEA() {
    const tasaNominal = this.document.nominal_rate / 100;
    const comision = this.document.commission || 0;
    const monto = this.document.amount || 0;

    const fechaEmision = new Date(this.document.issue_date);
    const fechaVencimiento = new Date(this.document.due_date);
    const fechaDescuento = new Date(this.document.discount_date);

    // Días entre la fecha de emisión y vencimiento
    const dias = (fechaVencimiento.getTime() - fechaEmision.getTime()) / (1000 * 3600 * 24);
    // Días entre la fecha de descuento y la fecha de emisión
    const diasDescuento = (fechaDescuento.getTime() - fechaEmision.getTime()) / (1000 * 3600 * 24);

    if (dias <= 0 || monto <= 0) {
      console.error("Las fechas o el monto no son válidos");
      return 0; // Evitar división por cero o resultados no válidos
    }

    // Fórmula de la TCEA:
    const tcea = Math.pow(
      (1 + ((tasaNominal + comision / monto)) / (1 - (diasDescuento / 360))),
      (360 / dias)
    ) - 1;

    // Multiplicamos por 100 para convertir a porcentaje
    return tcea * 100;
  }



  editDocument(id: number) {
    const index = this.documents.findIndex(d => d.id === id);
    if (index !== -1) {
      this.document = { ...this.documents[index] };
      this.isEditMode = true;
      this.openModal();
    } else {
      console.error('Document not found');
    }
  }

  toggleStatus(document: Documents): void {
    document.status = document.status === 'In Progress' ? 'Completed' : 'In Progress';

    this.documentsService.updateDocument(document).subscribe({
      next: (updatedDocument) => {
        // Optionally, update the local document with the updated data
        document = updatedDocument;
      },
      error: (error) => {
        console.error('Error updating document status:', error);
        // Optionally, revert the status change on error
        document.status = document.status === 'In Progress' ? 'Completed' : 'In Progress';
      },
      complete: () => {
        console.log('Document status update completed.');
      }
    });
  }


  deleteDocument(id: number) {
    this.documentsService.deleteDocument(id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== id);
      },
      error: (error) => console.error('Error deleting document:', error)
    });
  }

  resetForm() {
    this.document = new Documents(0, '', '', '', '', '', '', '', 0, 0, new Date(), new Date(), new Date(), '', 0, 0, 0, 0, '', 0);
    this.isEditMode = false;
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/portfolios']);
  }
}
