import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  welcomeMessage: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  signUp(): void {
    this.authService.signUp(this.email, this.password).subscribe(response => {
      this.authService.signIn(this.email, this.password).subscribe(loginResponse => {
        this.storageService.setUserId(loginResponse.id);
        this.storageService.setToken(loginResponse.token);
        console.log(this.storageService.getToken());
        const profile = {
          userId: loginResponse.id,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          photo: "/default-profile-photo.svg"
        };
        console.log(profile);
        this.profileService.createProfile(profile).subscribe(() => {
          this.router.navigate(['/portfolios']);
        }, error => {
          console.error('Error al crear el perfil', error);
        });
      }, error => {
        console.error('Login failed', error);
        this.welcomeMessage = 'Login failed. Please try again.';
        setTimeout(() => {
          this.welcomeMessage = '';
        }, 3000);
      });
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