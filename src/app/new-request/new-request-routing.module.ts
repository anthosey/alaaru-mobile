import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewRequestPage } from './new-request.page';

const routes: Routes = [
  {
    path: '',
    component: NewRequestPage
  },
  {
    path: 'description',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'cities',
    loadChildren: () => import('./cities/cities.module').then( m => m.CitiesPageModule)
  },
  {
    path: 'inter-city',
    loadChildren: () => import('./inter-city/inter-city.module').then( m => m.InterCityPageModule)
  },
  {
    path: 'cost-review',
    loadChildren: () => import('./cost-review/cost-review.module').then( m => m.CostReviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewRequestPageRoutingModule {}
