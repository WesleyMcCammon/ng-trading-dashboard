import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentPriceComponent } from './instrument-price-component';

describe('InstrumentPriceComponent', () => {
  let component: InstrumentPriceComponent;
  let fixture: ComponentFixture<InstrumentPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentPriceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
