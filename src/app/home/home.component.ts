import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { SalesDataService } from '../core/sales-data.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SalesInterface} from '../shared/sales-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  salesData:SalesInterface[];
  averageSales:number=0;
  averageRevenue:number=0;
  averageProfitUnit:number=0;
  salesYTD:number=0;
  profitYTD:number=0;
  av_cust_acc:number=0;
  av_cust_ltv:number=0;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private dataService:SalesDataService) {  }

  ngOnInit(): void {
    
    this.dataService.sendGetRequest().subscribe((data: SalesInterface[])=>{
         this.salesData = data;
         this.avSales();
         this.avRevenue();
         this.avProfitUnit();
         this.salesYTD=this.averageSales*this.salesData.length;
         this.profitYTD=3*this.averageProfitUnit*this.salesData.length;
         this.avCustomer();
    })
    
  }
  ngOnDestroy() {
    
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    
  }
  private avSales(){
    var av_sales;
    for(var i=0;i<this.salesData.length;i++){
       av_sales=this.salesData[i].sales1+this.salesData[i].sales2+this.salesData[i].sales3;
    }
    this.averageSales=av_sales;
  }
  private avRevenue(){
    var av_sales;
    var av_exp;

    for(var i=0;i<this.salesData.length;i++){
      av_sales=this.salesData[i].sales1+this.salesData[i].sales2+this.salesData[i].sales3;
      av_exp=this.salesData[i].expense1+this.salesData[i].expense2+this.salesData[i].expense3;
    }
    this.averageRevenue=(av_sales-av_exp);
  }
  private avProfitUnit(){
   this.averageProfitUnit=this.averageRevenue/3;
  }
  private avCustomer(){
    this.av_cust_acc=this.salesData.reduce(function(acc, curr){
      acc += curr.cust_acc;
      return acc;
      }, 0)/this.salesData.length;
    this.av_cust_ltv=this.salesData.reduce(function(acc, curr){
      acc += curr.cust_ltv;
      return acc;
      }, 0)/this.salesData.length;
  }
}
