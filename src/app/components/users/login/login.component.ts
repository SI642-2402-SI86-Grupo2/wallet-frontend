import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  welcomeMessage: string = '';

  constructor(private authService: AuthService, private storageService: StorageService) {}

  login(): void {
    this.authService.signIn(this.email, this.password).subscribe(response => {
      this.storageService.setUserId(response.id);
      this.storageService.setToken(response.token);
      this.welcomeMessage = 'Bienvenido';
      setTimeout(() => {
        this.welcomeMessage = '';
      }, 3000);
    }, error => {
      console.error('Login failed', error);
      this.welcomeMessage = 'Login failed. Please try again.';
      setTimeout(() => {
        this.welcomeMessage = '';
      }, 3000);
    });
  }
}
