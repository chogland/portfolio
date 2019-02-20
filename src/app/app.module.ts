import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PortfolioItemComponent } from './portfolio-item/portfolio-item.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from "@angular/common/http";
import { Shared } from './providers/shared';
import { PortfolioItemDetailsComponent } from './portfolio-item-details/portfolio-item-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioItemComponent,
    PortfolioComponent,
    AboutComponent,
    PortfolioItemDetailsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [Shared, 
    // { provide: ErrorHandler, useClass: RavenErrorHandler } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
