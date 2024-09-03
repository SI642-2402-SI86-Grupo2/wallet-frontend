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
  isModalOpen = false;
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
    this.errorMessage = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  addDocument() {
      if (!this.document.document_type || !this.document.financial_institutions_name || !this.document.number ||
        !this.document.series || !this.document.issuer_name || !this.document.issuer_ruc || !this.document.currecy ||
        !this.document.amount || !this.document.igv || !this.document.issue_date || !this.document.due_date ||
        !this.document.discount_date || !this.document.payment_terms || !this.document.nominal_rate || !this.document.effective_rate ||
        !this.document.tcea || !this.document.commission || !this.document.status) {
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
    if (this.isEditMode) {
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
      this.documentsService.addDocument(this.document).subscribe({
        next: (newDocument) => {
          this.documents.push(newDocument);
          this.closeModal();
        },
        error: (error) => console.error('Error adding document:', error)
      });
    }
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
