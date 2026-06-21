import { Injectable } from '@angular/core';
import { InstrumentService } from './instrument-service';
import indicatorLevelsData from '../data/indicator-levels.json';

export interface IndicatorLevel {
  group: string;
  name: string;
  value: number;
}

const SEED_BIDS = indicatorLevelsData.seedBids as Record<string, number>;
const LEVEL_OFFSETS = indicatorLevelsData.levelOffsets;

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
