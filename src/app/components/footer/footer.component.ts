import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  scrollTo(section: string, event: Event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
