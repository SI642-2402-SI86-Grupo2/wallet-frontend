import { Component, AfterViewInit } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
//<canvas id="canvas3d-1" class="w-full h-auto object-cover"></canvas>
    // Initialize first Spline application
    const canvas1 = document.getElementById('canvas3d-1') as HTMLCanvasElement;
    const app1 = new Application(canvas1);
    app1.load('https://prod.spline.design/9bp-r62lcNeqZ7Jx/scene.splinecode');

    // Initialize second Spline application
    const canvas2 = document.getElementById('canvas3d-2') as HTMLCanvasElement;
    const app2 = new Application(canvas2);
    app2.load('https://prod.spline.design/hczBqXhu-Hr7Vfpy/scene.splinecode');
  }
}
