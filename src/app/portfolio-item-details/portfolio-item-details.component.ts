import { Component, OnInit, Input } from '@angular/core';
import { item } from '../item';
import {Router, ActivatedRoute, Params} from "@angular/router";


@Component({
  selector: 'app-portfolio-item-details',
  templateUrl: './portfolio-item-details.component.html',
  styleUrls: ['./portfolio-item-details.component.scss']
})
export class PortfolioItemDetailsComponent implements OnInit {
  itemDataToShow: any;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  showDataOfMatchingID(ID) {
    for (let i = item.length - 1; i >= 0; i--) {
      if (item[i].id === ID) {
        this.itemDataToShow = item[i];
        break;
      }
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!params["id"]) {
        return; // Wrong parameter, show some error maybe.
      }else {
        // Use your parameter here
        console.log("ID: ", params["id"]);
        this.showDataOfMatchingID(params["id"]);
        
      }
    });
  }

}
