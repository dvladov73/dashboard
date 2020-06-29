import { Component, OnInit, OnDestroy } from '@angular/core';
import { SalesDataService } from '../core/sales-data.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SalesInterface} from '../shared/sales-interface';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements  OnInit, OnDestroy {
  salesData:SalesInterface[];
 
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(private dataService:SalesDataService) {  }

  ngOnInit(): void {
    
    this.dataService.sendGetRequest().subscribe((data: SalesInterface[])=>{
         this.salesData = data;
        
    })
    
  }
  ngOnDestroy() {
    
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    
  }
}