import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { SalesDataService } from '../core/sales-data.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SalesInterface, UnitData } from '../shared/sales-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  salesData:SalesInterface[];
  unitData:UnitData[];
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
