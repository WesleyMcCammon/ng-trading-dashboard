import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuturesContract } from '../../service/instrument-service';
import { InstrumentPriceComponent } from '../instrument-price-component/instrument-price-component';
import { InstrumentLevelsComponent } from "../instrument-levels-component/instrument-levels-component";

@Component({
  selector: 'app-instrument-card-component',
  imports: [InstrumentPriceComponent, InstrumentLevelsComponent],
  templateUrl: './instrument-card-component.html',
  styleUrl: './instrument-card-component.css',
})
export class InstrumentCardComponent {
  @Input() contract!: FuturesContract;
  @Output() expand = new EventEmitter<FuturesContract>();
}
