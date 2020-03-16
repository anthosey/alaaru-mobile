import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundWalletPage } from './fund-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: FundWalletPage
  },
  {
    path: 'process-fund',
    loadChildren: () => import('./process-fund/process-fund.module').then( m => m.ProcessFundPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundWalletPageRoutingModule {}
