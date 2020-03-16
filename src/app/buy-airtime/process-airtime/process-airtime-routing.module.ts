import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessAirtimePage } from './process-airtime.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessAirtimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessAirtimePageRoutingModule {}
