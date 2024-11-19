import { Component, HostListener, ElementRef } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false; // Para el menú móvil
  profileMenuOpen = false; // Para el menú de perfil

  constructor(
    private eRef: ElementRef,
    private router: Router
  ) {}


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    //document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }


  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }



  // routes
  goHome(): void {
    this.router.navigate(['/home']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goProfile(): void {
    this.router.navigate(['/profile']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goPending(): void {
    this.router.navigate(['/pending']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goPortfolios(): void {
    this.router.navigate(['/portfolios']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goReports(): void {
    this.router.navigate(['/reports']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goLogin(): void {
    this.router.navigate(['/login']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  goSignup(): void {
    this.router.navigate(['/signup']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  logout(): void {
    console.log('Logout');
    this.closeMenus(); // Cierra el menú desplegable
  }

// Método para cerrar los menús desplegables
  closeMenus(): void {
    this.menuOpen = false; // Cierra el menú móvil
    this.profileMenuOpen = false; // Cierra el menú de perfil (por si acaso)
    //document.body.style.overflow = this.menuOpen ? 'hidden' : '';

  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.profileMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }




}
