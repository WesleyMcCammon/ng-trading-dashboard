import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeRiskComponent } from './trade-risk-component';

describe('TradeRiskComponent', () => {
  let component: TradeRiskComponent;
  let fixture: ComponentFixture<TradeRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeRiskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeRiskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
