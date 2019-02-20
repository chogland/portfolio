import { Component, OnInit, Input } from '@angular/core';
import { item } from '../item';

@Component({
  selector: 'app-portfolio-item-details',
  templateUrl: './portfolio-item-details.component.html',
  styleUrls: ['./portfolio-item-details.component.scss']
})
export class PortfolioItemDetailsComponent implements OnInit {
  
  @Input() item: item;
  
  constructor() { }

  ngOnInit() {
  }

}
