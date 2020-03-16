import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemTrackingPage } from './item-tracking.page';

const routes: Routes = [
  {
    path: '',
    component: ItemTrackingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemTrackingPageRoutingModule {}
