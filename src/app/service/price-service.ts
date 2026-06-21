import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { InstrumentService } from './instrument-service';

export interface PriceQuote {
  symbol: string;
  bid: number;
  ask: number;
  sessionOpen: number;
  prevHigh: number;
  prevLow: number;
  weeklyHigh: number;
  weeklyLow: number;
}

const SEED_BIDS: Record<string, number> = {
  MNQ: 21400, NQ: 21400,
  MES: 5985,
  MYM: 42950, YM: 42950,
  RTY: 2145, M2K: 2145,
  GC: 3350, MGC: 3350,
  CL: 68.00, MCL: 68.00,
  SI: 33.00,
  '6E': 1.0950, M6E: 1.0950,
  '6B': 1.2850,
  '6J': 0.006580,
  '6A': 0.6480, M6A: 0.6480,
  '6C': 0.7350,
  '6S': 1.1150,
  '6N': 0.5900,
};

@Injectable({ providedIn: 'root' })
export class PriceService {
  private quotes = new Map<string, BehaviorSubject<PriceQuote>>();
  private seedQuotes = new Map<string, PriceQuote>();
  private tickSizes = new Map<string, number>();

  constructor(private instrumentService: InstrumentService) {
    this.initializeQuotes();
    interval(1000).subscribe(() => this.tick());
  }

  getQuote$(symbol: string): Observable<PriceQuote | undefined> {
    return this.quotes.get(symbol)?.asObservable() ?? of(undefined);
  }

  refresh(): void {
    for (const [symbol, seed] of this.seedQuotes) {
      this.quotes.get(symbol)?.next({ ...seed });
    }
  }

  private initializeQuotes(): void {
    for (const contract of this.instrumentService.getAll()) {
      const { symbol, tickSize } = contract;
      const bid = SEED_BIDS[symbol] ?? 100;
      const ask = this.round(bid + tickSize, tickSize);

      const quote: PriceQuote = {
        symbol,
        bid,
        ask,
        sessionOpen: bid,
        prevHigh: this.round(bid + 40 * tickSize, tickSize),
        prevLow: this.round(bid - 35 * tickSize, tickSize),
        weeklyHigh: this.round(bid + 85 * tickSize, tickSize),
        weeklyLow: this.round(bid - 75 * tickSize, tickSize),
      };

      this.seedQuotes.set(symbol, { ...quote });
      this.quotes.set(symbol, new BehaviorSubject<PriceQuote>(quote));
      this.tickSizes.set(symbol, tickSize);
    }
  }

  private tick(): void {
    for (const [symbol, subject] of this.quotes) {
      const quote = subject.value;
      const tickSize = this.tickSizes.get(symbol)!;
      const ticks = Math.floor(Math.random() * 7) - 3;
      const newBid = this.round(quote.bid + ticks * tickSize, tickSize);
      const newAsk = this.round(newBid + tickSize, tickSize);
      subject.next({ ...quote, bid: newBid, ask: newAsk });
    }
  }

  private round(value: number, tickSize: number): number {
    const decimals = this.decimalsOf(tickSize);
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  private decimalsOf(tickSize: number): number {
    const str = tickSize.toString();
    const dot = str.indexOf('.');
    return dot === -1 ? 0 : str.length - dot - 1;
  }
}
