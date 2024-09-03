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
  }


  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }




  //routes
  goHome(): void {
    this.router.navigate(['/home']);
  }
  goProfile(): void {
    this.router.navigate(['/profile']);
  }
  goPortfolios(): void {
    this.router.navigate(['/portfolios']);
  }
  goReports(): void {
    this.router.navigate(['/reports']);
  }
  goLogin(): void {
    this.router.navigate(['/login']);
  }
  goSignup(): void {
    this.router.navigate(['/signup']);
  }
  logout() {
    console.log('Logout');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.profileMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }




}
