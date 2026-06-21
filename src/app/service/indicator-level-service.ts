import { Injectable } from '@angular/core';
import { InstrumentService } from './instrument-service';

export interface IndicatorLevel {
  group: string;
  name: string;
  value: number;
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

const LEVEL_OFFSETS: Array<{ group: string; name: string; ticks: number }> = [
  { group: 'Pivot',          name: 'R3',               ticks:  120 },
  { group: 'Pivot',          name: 'R2',               ticks:   80 },
  { group: 'Pivot',          name: 'R1',               ticks:   40 },
  { group: 'Pivot',          name: 'Pivot',            ticks:   12 },
  { group: 'Pivot',          name: 'S1',               ticks:  -28 },
  { group: 'Pivot',          name: 'S2',               ticks:  -68 },
  { group: 'Pivot',          name: 'S3',               ticks: -108 },
  { group: 'VWAP',           name: 'Std Dev +3',       ticks:   95 },
  { group: 'VWAP',           name: 'Std Dev +2',       ticks:   65 },
  { group: 'VWAP',           name: 'Std Dev +1',       ticks:   35 },
  { group: 'VWAP',           name: 'VWAP',             ticks:    8 },
  { group: 'VWAP',           name: 'Std Dev -1',       ticks:  -20 },
  { group: 'VWAP',           name: 'Std Dev -2',       ticks:  -50 },
  { group: 'VWAP',           name: 'Std Dev -3',       ticks:  -80 },
  { group: 'Daily OHLC',  name: 'Daily Open',   ticks:  -20 },
  { group: 'Daily OHLC',  name: 'Daily High',   ticks:   55 },
  { group: 'Daily OHLC',  name: 'Daily Low',    ticks:  -48 },
  { group: 'Daily OHLC',  name: 'Daily',  ticks:   -8 },
  { group: 'Weekly OHLC',    name: 'Weekly Open',     ticks:  -75 },
  { group: 'Weekly OHLC',    name: 'Weekly High',     ticks:  105 },
  { group: 'Weekly OHLC',    name: 'Weekly Low',      ticks:  -95 },
  { group: 'Weekly OHLC',    name: 'Weekly Close',    ticks:  -60 },
  { group: 'Volume Area',    name: 'VAH', ticks:   22 },
  { group: 'Volume Area',    name: 'POC', ticks:    7 },
  { group: 'Volume Area',    name: 'VAL',  ticks:  -18 },
];

@Injectable({ providedIn: 'root' })
export class IndicatorLevelService {
  private levels = new Map<string, IndicatorLevel[]>();

  constructor(private instrumentService: InstrumentService) {
    for (const contract of this.instrumentService.getAll()) {
      const seedBid = SEED_BIDS[contract.symbol] ?? 100;
      this.levels.set(
        contract.symbol,
        LEVEL_OFFSETS.map(({ group, name, ticks }) => ({
          group,
          name,
          value: this.round(seedBid + ticks * contract.tickSize, contract.tickSize),
        }))
      );
    }
  }

  getLevels(symbol: string): IndicatorLevel[] {
    return this.levels.get(symbol) ?? [];
  }

  private round(value: number, tickSize: number): number {
    const str = tickSize.toString();
    const dot = str.indexOf('.');
    const decimals = dot === -1 ? 0 : str.length - dot - 1;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
