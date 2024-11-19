
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  welcomeMessage: string = '';

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  signUp(): void {
    this.authService.signUp(this.email, this.password).subscribe(response => {
      console.log('Cuenta creada exitosamente', response);
      this.welcomeMessage = 'Cuenta creada exitosamente. Bienvenido';
      setTimeout(() => {
        this.welcomeMessage = '';
        this.router.navigate(['/login']);
      }, 3000);
    }, error => {
      console.error('Error al crear la cuenta', error);
    });
  }

  logout(): void {
    this.storageService.clearToken();
    this.router.navigate(['/login']);
  }

  hasToken(): boolean {
    return !!this.storageService.getToken();
  }
}
