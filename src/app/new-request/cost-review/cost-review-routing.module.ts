import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CostReviewPage } from './cost-review.page';

const routes: Routes = [
  {
    path: '',
    component: CostReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostReviewPageRoutingModule {}
