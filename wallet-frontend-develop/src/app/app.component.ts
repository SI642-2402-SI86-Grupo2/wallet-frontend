import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAccessGranted: boolean = false; // Estado de acceso
  title = 'wallet-frontend' ;
  isAuth = false;
  constructor(private authService: AuthService) {
    this.checkAccess();
  }
  ngOnInit() {
    this.checkToken();
    this.authService.isSignedIn.subscribe((isAuth) => {
      this.isAuth = isAuth;
      this.isAccessGranted = isAuth;
    });
  }

  checkToken() {
    this.authService.validateToken().subscribe(
      (isValid) => {
        this.isAccessGranted = isValid;
        this.isAuth = isValid;
      },
      () => {
        this.authService.logout(); // Handle invalid token
      }
    );
  }

  logout() {
    this.authService.logout();
    this.isAccessGranted = false;
  }
  checkAccess() {
    // Verifica si hay un código válido en localStorage
    const validCode = localStorage.getItem('validCode');
    const expiryDate = localStorage.getItem('accessExpiry');

    if (validCode && expiryDate) {
      const currentTime = new Date().getTime();
      const expirationTime = new Date(expiryDate).getTime();

      // Verifica si la fecha de expiración es mayor que el tiempo actual
      this.isAccessGranted = currentTime < expirationTime;
    } else {
      this.isAccessGranted = false;
    }
  }

  onAccessGranted() {
    // Cambiar el estado de acceso cuando se emite el evento
    this.isAccessGranted = true;

    // Iniciar un temporizador para comprobar si el acceso ha expirado
    setTimeout(() => {
      this.logout(); // Llamar al método de cierre de sesión después de 1 día
    }, 86400000); // 1 día en milisegundos (24 * 60 * 60 * ) = 86400000
  }

  /*logout() {
    // Eliminar el código de acceso del localStorage
    localStorage.removeItem('validCode');
    this.isAccessGranted = false; // Cambiar el estado de acceso
  }*/



}
