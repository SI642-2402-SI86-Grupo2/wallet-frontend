import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  welcomeMessage: string = '';

  constructor(private authService: AuthService) {}

  signUp(): void {
    this.authService.signUp(this.email, this.password).subscribe(response => {
      console.log('Cuenta creada exitosamente', response);
      this.welcomeMessage = 'Cuenta creada exitosamente.Bienvenido';
      setTimeout(() => {
        this.welcomeMessage = '';
      }, 3000);
    }, error => {
      console.error('Error al crear la cuenta', error);
    });
  }
}
