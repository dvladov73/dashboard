import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { SalesComponent } from './sales/sales.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesChartComponent } from './home/sales-chart/sales-chart.component';
import { PieChartComponent }  from './home/pie-chart/pie-chart.component';
import { AreaChartComponent } from './home/area-chart/area-chart.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfChartComponent } from './sales/perf-chart/perf-chart.component';
import { KpiChartComponent } from './sales/kpi-chart/kpi-chart.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SalesComponent,
    InventoryComponent,
    PagenotfoundComponent,
    SalesChartComponent,
    PieChartComponent,
    AreaChartComponent,
    PerfChartComponent,
    KpiChartComponent,
   
   
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatIconModule,
    MatRadioModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
