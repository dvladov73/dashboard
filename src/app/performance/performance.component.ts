import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerformanceDataService } from '../core/performance-data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SalesPerformance } from '../shared/sales-interface';
import { SalesChartComponent } from '../home/sales-chart/sales-chart.component';



@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit, OnDestroy {
  
  salesData: SalesPerformance[];
  //temp: number[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  //YTD results
  cust_YTD: number;
  budget_sales_YTD:number;
  actual_sales_YTD:number;
  orders_received_YTD:number;
  orders_delivered_YTD:number;

  
  constructor(private dataService:PerformanceDataService) {   }
 
  ngOnInit(): void {
    
    this.dataService.sendGetRequest().subscribe((data: any[])=>{
      console.log(data);
      this.salesData = data;
      this.YTD();
          
    })

    
  }
  ngOnDestroy() {
    
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    
  }

 YTD ()
 {
  this.cust_YTD=this.salesData.reduce(function(acc, curr){
    acc += curr.clients;
    return acc;
    }, 0);
    this.budget_sales_YTD=this.salesData.reduce(function(acc, curr){
      acc += curr.budget_sales;
      return acc;
      }, 0);
    this.actual_sales_YTD=this.salesData.reduce(function(acc, curr){
      acc += curr.actual_sales;
      return acc;
      }, 0); 
    this.orders_received_YTD=this.salesData.reduce(function(acc, curr){
      acc += curr.orders_received;
      return acc;
      }, 0);  
    this.orders_delivered_YTD=this.salesData.reduce(function(acc, curr){
        acc += curr.orders_delivered;
        return acc;
        }, 0);
 }

}


