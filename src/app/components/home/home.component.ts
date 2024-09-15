import { Component, AfterViewInit } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Asegúrate de que el nombre del archivo sea correcto
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Initialize first Spline application
    const canvas1 = document.getElementById('canvas3d-1') as HTMLCanvasElement;
    const app1 = new Application(canvas1);
    app1.load('https://prod.spline.design/9bp-r62lcNeqZ7Jx/scene.splinecode');

    // Initialize second Spline application
    const canvas2 = document.getElementById('canvas3d-2') as HTMLCanvasElement;
    const app2 = new Application(canvas2);
    app2.load('https://prod.spline.design/hczBqXhu-Hr7Vfpy/scene.splinecode');
  }

  onMouseEnter(iconId: string) {
    const icon = document.querySelector(`#${iconId}`) as HTMLElement;
    if (icon) {
      icon.setAttribute('trigger', 'loop');
    }
  }

  onMouseLeave(iconId: string) {
    const icon = document.querySelector(`#${iconId}`) as HTMLElement;
    if (icon) {
      icon.setAttribute('trigger', 'morph');
    }
  }
}
