import { Injectable } from '@angular/core';
import { item } from './item';
import { ITEMS } from './mock-portfolioitems';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  getItems(): Observable<item[]> {
    return of(ITEMS);
  }
  constructor() { }
}
