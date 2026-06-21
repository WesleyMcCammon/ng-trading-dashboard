import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentLevelsComponent } from './instrument-levels-component';

describe('InstrumentLevelsComponent', () => {
  let component: InstrumentLevelsComponent;
  let fixture: ComponentFixture<InstrumentLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentLevelsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
