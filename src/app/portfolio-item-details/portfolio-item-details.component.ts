import { Component, OnInit, Input } from '@angular/core';
import { ITEMS } from '../mock-portfolioitems';
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
    for (let i = ITEMS.length - 1; i >= 0; i--) {
      // if (ITEMS[i].id === ID) { TODO: Why doesn't this work!? ITEMS[i].id is int, is ID not int?
        if (ITEMS[i].id == ID) {
        this.itemDataToShow = ITEMS[i];
        break;
      }
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!params["id"]) {

        return; // TODO: show some error maybe.
      }else {
        this.showDataOfMatchingID(params["id"]);
      }
    });
  }

}
