import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { InstrumentService } from '../../service/instrument-service';
import { CategoryService } from '../../service/category-service';

const MONTH_NAMES: Record<string, string> = {
  F: 'Jan', G: 'Feb', H: 'Mar', J: 'Apr', K: 'May', M: 'Jun',
  N: 'Jul', Q: 'Aug', U: 'Sep', V: 'Oct', X: 'Nov', Z: 'Dec',
};

@Component({
  selector: 'app-rollover-component',
  imports: [RouterLink],
  templateUrl: './rollover-component.html',
  styleUrl: './rollover-component.css',
})
export class RolloverComponent {
  private instrumentService = inject(InstrumentService);
  private categoryService = inject(CategoryService);

  readonly categories = this.categoryService.categories;

  private contracts = toSignal(this.instrumentService.contracts$, { initialValue: [] });
  private pendingRolls = signal(new Set<string>());
  private savedRolls = signal(new Set<string>());

  selectedCategory = signal<string | null>(null);

  private allRows = computed(() =>
    this.contracts().map((contract) => ({
      contract,
      nextFrontMonth: this.instrumentService.computeNextFrontMonth(contract.symbol),
      pending: this.pendingRolls().has(contract.symbol),
      rolled: this.savedRolls().has(contract.symbol),
    }))
  );

  rows = computed(() => {
    const cat = this.selectedCategory();
    return cat
      ? this.allRows().filter((r) => r.contract.category === cat)
      : this.allRows();
  });

  pendingCount = computed(() => this.pendingRolls().size);
  hasPending = computed(() => this.pendingRolls().size > 0);

  selectCategory(cat: string | null): void {
    this.selectedCategory.set(cat);
  }

  roll(symbol: string): void {
    this.pendingRolls.update((s) => new Set([...s, symbol]));
  }

  rollAll(): void {
    const symbols = this.rows().map((r) => r.contract.symbol);
    this.pendingRolls.update((s) => new Set([...s, ...symbols]));
  }

  save(): void {
    const pending = this.pendingRolls();
    pending.forEach((symbol) => this.instrumentService.rollFrontMonth(symbol));
    this.savedRolls.update((s) => new Set([...s, ...pending]));
    this.pendingRolls.set(new Set());
  }

  formatMonth(frontMonth: string, symbol: string): string {
    const monthCode = frontMonth[symbol.length];
    const yearStr = frontMonth.slice(symbol.length + 1);
    return `${MONTH_NAMES[monthCode] ?? monthCode} '${yearStr}`;
  }
}
