import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-banner-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './banner-component.html',
  styleUrl: './banner-component.css',
})
export class BannerComponent {}
