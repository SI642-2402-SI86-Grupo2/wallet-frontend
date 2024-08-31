import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false; // Para el menú móvil
  profileMenuOpen = false; // Para el menú de perfil

  constructor(private eRef: ElementRef) {}

  // Método para alternar el menú móvil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Método para alternar el menú de perfil
  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // Método para cerrar sesión
  logout() {
    // Implementa la lógica para cerrar sesión aquí
    console.log('Logout');
  }

  // Detectar clics fuera del menú de perfil y cerrar el menú si está abierto
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.profileMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }
}
