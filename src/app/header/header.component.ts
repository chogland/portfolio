import { Component, ElementRef, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'], 
  inputs: ['header']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  

}
