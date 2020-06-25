import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { HomeComponent } from './home.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { PerformanceComponent } from '../performance/performance.component';


@NgModule({
  declarations: [SalesChartComponent, PieChartComponent, AreaChartComponent],
  imports: [
    CommonModule,
    HomeComponent,
    SalesChartComponent,
    PieChartComponent,
    AreaChartComponent,
    PerformanceComponent
  ]
})
export class HomeModule { }
