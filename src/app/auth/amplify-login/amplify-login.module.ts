import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmplifyLoginPageRoutingModule } from './amplify-login-routing.module';

import { AmplifyLoginPage } from './amplify-login.page';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmplifyLoginPageRoutingModule,
    AmplifyAngularModule
  ],
  declarations: [AmplifyLoginPage],
  providers: [AmplifyService]
})
export class AmplifyLoginPageModule {}
