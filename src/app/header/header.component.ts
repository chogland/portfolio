import { Router } from '@angular/router';
import { Component, ElementRef, Inject, OnInit, HostListener } from '@angular/core';

declare const window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  inputs: ['header']
})
export class HeaderComponent implements OnInit {

  header: string;
  isCollapsed = true;
  constructor() { }

  ngOnInit() {}

@HostListener("window:scroll", [])
  onWindowScroll() {

    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 222) {
      //this.header = "small";
      
    } else if (number < 100) {
      //this.header = "large"
        
    }
  }
}