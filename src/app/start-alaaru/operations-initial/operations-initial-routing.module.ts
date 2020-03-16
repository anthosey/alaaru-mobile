import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationsInitialPage } from './operations-initial.page';

const routes: Routes = [
  {
    path: '',
    component: OperationsInitialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsInitialPageRoutingModule {}
