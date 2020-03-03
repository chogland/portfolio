import { Router } from '@angular/router';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  inputs: ['header']
})
export class HeaderComponent implements OnInit {

  
  constructor() { }

  ngOnInit() {
    $(document).on("scroll", function() {

      if($(document).scrollTop()>100) {
        $("header").removeClass("large").addClass("small");
      } else {
        $("header").removeClass("small").addClass("large");
      }
      
    });
  }
}
