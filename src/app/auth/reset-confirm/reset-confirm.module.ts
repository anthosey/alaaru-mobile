import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetConfirmPageRoutingModule } from './reset-confirm-routing.module';

import { ResetConfirmPage } from './reset-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetConfirmPageRoutingModule
  ],
  declarations: [ResetConfirmPage]
})
export class ResetConfirmPageModule {}
