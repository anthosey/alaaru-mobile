import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessFundPage } from './process-fund.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessFundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessFundPageRoutingModule {}
