import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';

import { HomeComponent } from './home/home.component';
import { SalesComponent } from './sales/sales.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesChartComponent } from './home/sales-chart/sales-chart.component';
import { PieChartComponent }  from './home/pie-chart/pie-chart.component';
import { AreaChartComponent } from './home/area-chart/area-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SalesComponent,
    InventoryComponent,
    PagenotfoundComponent,
   
    SalesChartComponent,
    PieChartComponent,
    AreaChartComponent
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSlideToggleModule,
    
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
