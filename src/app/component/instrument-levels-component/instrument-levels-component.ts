import { Component, computed, inject, input, signal, Input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, NgClass } from '@angular/common';
import { switchMap } from 'rxjs';
import { FuturesContract } from '../../service/instrument-service';
import { PriceService } from '../../service/price-service';
import { IndicatorLevelService } from '../../service/indicator-level-service';

export type DeltaFilter = 'all' | 'above' | 'below';

@Component({
  selector: 'app-instrument-levels-component',
  imports: [DecimalPipe, NgClass],
  templateUrl: './instrument-levels-component.html',
  styleUrl: './instrument-levels-component.css',
})
export class InstrumentLevelsComponent {
  @Input() filter: string = '';
  @Input() indicatorDisplayCount: number = -1;
  @Input() title: string = '';

  contract = input.required<FuturesContract>();

  private priceService = inject(PriceService);
  private indicatorLevelService = inject(IndicatorLevelService);

  deltaFilter = signal<DeltaFilter>('all');

  quote = toSignal(
    toObservable(computed(() => this.contract().symbol)).pipe(
      switchMap((symbol) => this.priceService.getQuote$(symbol))
    )
  );

  topLevels = computed(() => {
    const q = this.quote();
    if (!q) return [];
    const filter = this.deltaFilter();

    const levels = this.indicatorLevelService.getLevels(this.contract().symbol);
    const displayCount = this.indicatorDisplayCount === -1 ? levels.length : this.indicatorDisplayCount;

    return levels
      .map((level) => ({ ...level, delta: q.bid - level.value }))
      .filter((level) => {
        if (this.filter === 'above') return level.delta >= 0;
        if (this.filter === 'below') return level.delta < 0;
        return true;
      })
      .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta))
      .slice(0, displayCount);
  });

  decimalFormat = computed(() => {
    const str = this.contract().tickSize.toString();
    const d = str.includes('.') ? str.length - str.indexOf('.') - 1 : 0;
    return `1.${d}-${d}`;
  });

  setFilter(filter: DeltaFilter): void {
    this.deltaFilter.set(this.deltaFilter() === filter ? 'all' : filter);
  }

}
