import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, NgClass } from '@angular/common';
import { switchMap } from 'rxjs';
import { FuturesContract } from '../../service/instrument-service';
import { PriceService } from '../../service/price-service';

@Component({
  selector: 'app-instrument-price-component',
  imports: [DecimalPipe, NgClass],
  templateUrl: './instrument-price-component.html',
  styleUrl: './instrument-price-component.css',
})
export class InstrumentPriceComponent {
  contract = input.required<FuturesContract>();

  private priceService = inject(PriceService);

  quote = toSignal(
    toObservable(computed(() => this.contract().symbol)).pipe(
      switchMap((symbol) => this.priceService.getQuote$(symbol))
    )
  );

  delta = computed(() => {
    const q = this.quote();
    return q ? q.bid - q.sessionOpen : 0;
  });

  deltaPercent = computed(() => {
    const q = this.quote();
    return q ? (this.delta() / q.sessionOpen) * 100 : 0;
  });

  decimalFormat = computed(() => {
    const str = this.contract().tickSize.toString();
    const d = str.includes('.') ? str.length - str.indexOf('.') - 1 : 0;
    return `1.${d}-${d}`;
  });
}
