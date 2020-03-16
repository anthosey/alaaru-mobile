import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FundWalletPageRoutingModule } from './fund-wallet-routing.module';

import { FundWalletPage } from './fund-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FundWalletPageRoutingModule
  ],
  declarations: [FundWalletPage]
})
export class FundWalletPageModule {}
