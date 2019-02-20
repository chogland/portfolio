import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Shared } from './providers/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
 
  constructor(public portfolio:Shared, public meta: Meta){
    this.meta.addTags([
        {name: 'og:title', content: 'Charles D. Hogland | portfolio'},
        {name: 'og:description', content: 'Hello, my name is Charles Hogland. I am a UX Developer ( Front End / Angular / WordPress ) and this is my portfolio page.'},
        {name: 'og:image', content: '/assets/img/social-min.png'},
        {name: 'author', content: 'Charles Hogland'},
        {name: 'keywords', content: 'Angular, Front-End, Portfolio, Charles Hogland, Charles, Hogland'},
        {name: 'description', content: 'Hello, my name is Charles Hogland. I am a UX Developer ( Front End / Angular / WordPress ) and this is my portfolio page.'}
    ]);
}
ngOnInit(){
    if(!this.portfolio.texts){
        this.portfolio.getTexts().subscribe(
            data => {
                console.log(data);
                this.portfolio.texts = data;
            },
            err => console.error(err)
        );
    }
}
}
