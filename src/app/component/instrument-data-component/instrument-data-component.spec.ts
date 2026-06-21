import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentDataComponent } from './instrument-data-component';

describe('InstrumentDataComponent', () => {
  let component: InstrumentDataComponent;
  let fixture: ComponentFixture<InstrumentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentDataComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
