import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmplifyLoginPage } from './amplify-login.page';

const routes: Routes = [
  {
    path: '',
    component: AmplifyLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmplifyLoginPageRoutingModule {}
