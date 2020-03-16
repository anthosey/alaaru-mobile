import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyAirtimePage } from './buy-airtime.page';

const routes: Routes = [
  {
    path: '',
    component: BuyAirtimePage
  },
  {
    path: 'process-airtime',
    loadChildren: () => import('./process-airtime/process-airtime.module').then( m => m.ProcessAirtimePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyAirtimePageRoutingModule {}
