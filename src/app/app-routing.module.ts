import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './about/about.component';
import { PortfolioItemDetailsComponent } from './portfolio-item-details/portfolio-item-details.component';

const routes: Routes = [
  { 
    path: '**', 
    redirectTo: '/portfolio', 
    pathMatch: 'full' 
  },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  { 
    path: 'portfolio/details/:id', 
    component: PortfolioItemDetailsComponent 
  }
];

@NgModule({     
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
