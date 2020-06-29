import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfChartComponent } from './perf-chart.component';

describe('PerfChartComponent', () => {
  let component: PerfChartComponent;
  let fixture: ComponentFixture<PerfChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
