import { Component, OnInit } from '@angular/core';

import { item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.scss']
})
export class PortfolioItemComponent implements OnInit {
  
  selectedItem: item;

  items: item[];
  
  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();
   }

  onSelect(item: item): void {
    this.selectedItem = item;
  }

  getItems(): void {
    this.itemService.getItems()
    .subscribe(items => this.items = items);
  }
  

 

}
