import { Component, AfterViewInit } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
//<canvas id="canvas3d" class="w-full h-auto object-cover"></canvas>
    const canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
    const app = new Application(canvas);
    app.load('https://prod.spline.design/9bp-r62lcNeqZ7Jx/scene.splinecode');
  }
}
