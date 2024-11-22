import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// Definición de interfaces para los portafolios y documentos
interface Portfolio {
  id: number;
  profileId: string;
  portfolioName: string;
  description: string;
  discountDate: Date;
  totalTcea: number;
  documents?: Document[];
}

interface Document {
  id: number;
  title: string;
  description: string;
  tcea: number;
  portfolioId: number;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private portfoliosCollection: AngularFirestoreCollection<Portfolio>;
  private documentsCollection: AngularFirestoreCollection<Document>;
  private reportsCollection: AngularFirestoreCollection<any>;  // Puedes definir una interfaz también si se conoce la estructura de un reporte

  constructor(private firestore: AngularFirestore) {
    // Inicializar las colecciones de Firestore con tipos más específicos
    this.portfoliosCollection = this.firestore.collection<Portfolio>('portfolios');
    this.documentsCollection = this.firestore.collection<Document>('documents');
    this.reportsCollection = this.firestore.collection('reports');
  }

  /**
   * Obtener todos los portafolios
   * @returns Observable con los portafolios
   */
  getPortfolios(): Observable<Portfolio[]> {
    return this.portfoliosCollection.valueChanges({ idField: 'id' });
  }

  /**
   * Obtener portafolios por usuario
   * @param userId - ID del usuario
   * @returns Observable con los portafolios del usuario
   */
  getPortfoliosByUserId(userId: string): Observable<Portfolio[]> {
    return this.firestore
      .collection<Portfolio>('portfolios', (ref) => ref.where('profileId', '==', userId))
      .valueChanges({ idField: 'id' });
  }

  /**
   * Obtener todos los documentos
   * @returns Observable con todos los documentos
   */
  getDocuments(): Observable<Document[]> {
    return this.documentsCollection.valueChanges({ idField: 'id' });
  }

  /**
   * Obtener documentos por ID de portafolio
   * @param portfolioId - ID del portafolio
   * @returns Observable con los documentos del portafolio
   */
  getDocumentsByPortfolioId(portfolioId: number): Observable<Document[]> {
    return this.firestore
      .collection<Document>('documents', (ref) => ref.where('portfolioId', '==', portfolioId))
      .valueChanges({ idField: 'id' });
  }

  /**
   * Guardar un reporte en Firebase
   * @param report - Datos del reporte
   */
  async saveReport(report: any): Promise<void> {
    try {
      await this.reportsCollection.add(report);
      console.log('Report saved successfully in Firebase.');
    } catch (error) {
      console.error('Error saving report to Firebase:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los reportes guardados
   * @returns Observable con todos los reportes
   */
  getReports(): Observable<any[]> {
    return this.reportsCollection.valueChanges({ idField: 'id' });
  }
}
