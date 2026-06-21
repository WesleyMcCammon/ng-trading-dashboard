import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentCardComponent } from './instrument-card-component';

describe('InstrumentCardComponent', () => {
  let component: InstrumentCardComponent;
  let fixture: ComponentFixture<InstrumentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
