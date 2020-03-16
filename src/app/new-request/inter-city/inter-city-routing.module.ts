import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterCityPage } from './inter-city.page';

const routes: Routes = [
  {
    path: '',
    component: InterCityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterCityPageRoutingModule {}
