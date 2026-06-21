import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-trade-risk-component',
  imports: [NgClass],
  templateUrl: './trade-risk-component.html',
  styleUrl: './trade-risk-component.css',
})
export class TradeRiskComponent {
  side = signal<'buy' | 'sell' | null>(null);

  selectSide(side: 'buy' | 'sell'): void {
    this.side.set(this.side() === side ? null : side);
  }
}
