import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategorySelectorComponent } from '../category-selector-component/category-selector-component';
import { CategoryService } from '../../service/category-service';
import { InstrumentCardComponent } from '../instrument-card-component/instrument-card-component';
import { FuturesContract, InstrumentService } from '../../service/instrument-service';
import { InstrumentSummaryComponent } from '../instrument-summary-component/instrument-summary-component';
import { PriceService } from '../../service/price-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [CategorySelectorComponent, InstrumentCardComponent, InstrumentSummaryComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  categoryNames: string[] = [];
  visibleInstruments: FuturesContract[] = [];
  selectedContract = signal<FuturesContract | null>(null);

  private categorySub!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private instrumentService: InstrumentService,
    private priceService: PriceService
  ) {}

  ngOnInit(): void {
    this.categoryNames = this.categoryService.categories;
    this.categoryService.selectAll();
    this.priceService.refresh();

    this.categorySub = this.categoryService.selectedCategories$.subscribe(
      (selected) => (this.visibleInstruments = this.instrumentService.getByCategories(selected))
    );
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

  refresh(): void {
    this.categoryService.selectAll();
    this.priceService.refresh();
  }
}
