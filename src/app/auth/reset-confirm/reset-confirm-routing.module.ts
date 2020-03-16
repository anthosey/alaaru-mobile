import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetConfirmPage } from './reset-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ResetConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetConfirmPageRoutingModule {}
