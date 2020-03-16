import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTypesPage } from './vehicle-types.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleTypesPageRoutingModule {}
