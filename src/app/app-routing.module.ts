import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './about/about.component';
import { PortfolioItemDetailsComponent } from './portfolio-item-details/portfolio-item-details.component';

const routes: Routes = [
  
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  { 
    path: 'portfolio/:id', 
    component: PortfolioItemDetailsComponent,
    data: {show: false}
  },
  { 
    path: '**', 
    redirectTo: '/about', 
    pathMatch: 'full' 
  }
];

@NgModule({     
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
