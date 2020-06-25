import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import {  throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UnitData } from '../shared/sales-interface';

@Injectable({
  providedIn: 'root'
})
export class UnitDataService {
  private REST_API_SERVER = './assets/unit-data.json';

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest(): Observable <UnitData[]>{
    return this.httpClient.get <UnitData[]>(this.REST_API_SERVER)
           .pipe(catchError(this.handleError));
  }
}
