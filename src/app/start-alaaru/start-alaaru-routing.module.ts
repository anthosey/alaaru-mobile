import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartAlaaruPage } from './start-alaaru.page';

const routes: Routes = [
  {
    path: '',
    component: StartAlaaruPage
  },
  {
    path: 'addresses',
    loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./locations/locations.module').then( m => m.LocationsPageModule)
  },
  {
    path: 'operations-initial',
    loadChildren: () => import('./operations-initial/operations-initial.module').then( m => m.OperationsInitialPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartAlaaruPageRoutingModule {}
