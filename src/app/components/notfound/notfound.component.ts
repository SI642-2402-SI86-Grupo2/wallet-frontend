import {Component, ElementRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {

  constructor(
    private router: Router
  ) {}

  // routes
  goHome(): void {
    this.router.navigate(['/home']);
  }
}
