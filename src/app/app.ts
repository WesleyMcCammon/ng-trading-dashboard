import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BannerComponent } from './component/banner-component/banner-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-trading-dashboard');
}
