import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent {
  validCodes = ['u20221a928', 'U20221a928','u20211c807','U20211c807','u202218451','U202218451','u202211742','U202211742']; // Códigos válidos
  inputCode: string = ''; // Para almacenar el código ingresado
  message: string = ''; // Mensaje de resultado

  @Output() accessGranted = new EventEmitter<void>(); // Emitir evento cuando se concede el acceso

  validateCode() {
    // Verificar si el código ingresado es válido
    if (this.validCodes.includes(this.inputCode)) {
      localStorage.setItem('validCode', this.inputCode); // Guardar en local storage
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1); // Establecer fecha de expiración en 1 día
      localStorage.setItem('accessExpiry', expiryDate.toString()); // Guardar la fecha de expiración

      this.message = 'Código válido. Accediendo a la aplicación...';

      // Emitir evento de acceso concedido
      this.accessGranted.emit();
    } else {
      this.message = 'Código inválido. Inténtalo de nuevo.';
    }
  }
}
