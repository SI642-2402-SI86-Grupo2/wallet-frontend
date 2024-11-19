import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../.././services/storage.service';

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
    private router: Router,
    private storageService: StorageService
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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
    this.storageService.clearToken();
    this.router.navigate(['/login']);
    this.closeMenus(); // Cierra el menú desplegable
  }

  hasToken(): boolean {
    return !!this.storageService.getToken();
  }

  // Método para cerrar los menús desplegables
  closeMenus(): void {
    this.menuOpen = false; // Cierra el menú móvil
    this.profileMenuOpen = false; // Cierra el menú de perfil (por si acaso)
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.profileMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }
}
