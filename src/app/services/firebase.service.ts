
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Esto hace que el servicio sea accesible en toda la aplicación
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  getDocuments(): Observable<any[]> {
    return this.firestore.collection('documents').valueChanges();
  }

  getPortfolios(): Observable<any[]> {
    return this.firestore.collection('portfolios').valueChanges();
  }

  async saveReport(report: any): Promise<void> {
    await this.firestore.collection('reports').add(report);
  }
}
