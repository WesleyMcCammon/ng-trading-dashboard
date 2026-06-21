import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import contractsData from '../data/contracts.json';

export type ContractType = 'Standard' | 'E-mini' | 'Micro';

export interface FuturesContract {
  symbol: string;
  name: string;
  contractType: ContractType;
  category: string;
  tickSize: number;
  tickValue: number;
  pointValue: number;
  ticksPerPoint: number;
  frontMonth: string;
}

// Valid expiry months per symbol based on CME contract schedules
const CONTRACT_MONTH_SCHEDULE: Record<string, string[]> = {
  MNQ: ['H', 'M', 'U', 'Z'],
  MES: ['H', 'M', 'U', 'Z'],
  MYM: ['H', 'M', 'U', 'Z'],
  NQ:  ['H', 'M', 'U', 'Z'],
  YM:  ['H', 'M', 'U', 'Z'],
  RTY: ['H', 'M', 'U', 'Z'],
  M2K: ['H', 'M', 'U', 'Z'],
  MGC: ['G', 'J', 'M', 'Q', 'V', 'Z'],
  GC:  ['G', 'J', 'M', 'Q', 'V', 'Z'],
  SI:  ['H', 'K', 'N', 'U', 'Z'],
  MCL: ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'],
  CL:  ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'],
  '6E': ['H', 'M', 'U', 'Z'],
  '6B': ['H', 'M', 'U', 'Z'],
  '6J': ['H', 'M', 'U', 'Z'],
  '6A': ['H', 'M', 'U', 'Z'],
  '6C': ['H', 'M', 'U', 'Z'],
  '6S': ['H', 'M', 'U', 'Z'],
  '6N': ['H', 'M', 'U', 'Z'],
  M6E: ['H', 'M', 'U', 'Z'],
  M6A: ['H', 'M', 'U', 'Z'],
};

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  private contracts: FuturesContract[] = contractsData as FuturesContract[];
  private contractsSubject = new BehaviorSubject<FuturesContract[]>(this.contracts);
  readonly contracts$ = this.contractsSubject.asObservable();

  getAll(): FuturesContract[] {
    return this.contracts;
  }

  getBySymbol(symbol: string): FuturesContract | undefined {
    return this.contracts.find((c) => c.symbol === symbol);
  }

  getByCategory(category: string): FuturesContract[] {
    return this.contracts.filter((c) => c.category === category);
  }

  getByCategories(categories: string[]): FuturesContract[] {
    if (categories.length === 0) return [];
    return this.contracts.filter((c) => categories.includes(c.category));
  }

  computeNextFrontMonth(symbol: string): string {
    const contract = this.getBySymbol(symbol);
    if (!contract) return '';
    const schedule = CONTRACT_MONTH_SCHEDULE[symbol] ?? ['H', 'M', 'U', 'Z'];
    const current = contract.frontMonth;
    const monthCode = current[symbol.length];
    const yearStr = current.slice(symbol.length + 1);
    const year = parseInt(yearStr, 10);
    const idx = schedule.indexOf(monthCode);
    if (idx === -1) return current;
    const nextIdx = (idx + 1) % schedule.length;
    const nextMonth = schedule[nextIdx];
    const nextYearStr = nextIdx === 0 ? String(year + 1).padStart(2, '0') : yearStr;
    return `${symbol}${nextMonth}${nextYearStr}`;
  }

  rollFrontMonth(symbol: string): void {
    const next = this.computeNextFrontMonth(symbol);
    const contract = this.contracts.find((c) => c.symbol === symbol);
    if (contract && next) {
      contract.frontMonth = next;
      this.contractsSubject.next([...this.contracts]);
    }
  }

  rollAll(): void {
    const updates = this.contracts.map((c) => ({
      symbol: c.symbol,
      next: this.computeNextFrontMonth(c.symbol),
    }));
    updates.forEach(({ symbol, next }) => {
      const c = this.contracts.find((x) => x.symbol === symbol);
      if (c && next) c.frontMonth = next;
    });
    this.contractsSubject.next([...this.contracts]);
  }
}
