import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuturesContract } from '../../service/instrument-service';
import { InstrumentPriceComponent } from '../instrument-price-component/instrument-price-component';
import { InstrumentLevelsComponent } from '../instrument-levels-component/instrument-levels-component';
import { TradeRiskComponent } from '../trade-risk-component/trade-risk-component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-instrument-summary-component',
  imports: [InstrumentPriceComponent, InstrumentLevelsComponent, TradeRiskComponent, DecimalPipe],
  templateUrl: './instrument-summary-component.html',
  styleUrl: './instrument-summary-component.css',
})
export class InstrumentSummaryComponent {
  @Input() contract!: FuturesContract;
  @Output() closeEvent = new EventEmitter<void>();
}
