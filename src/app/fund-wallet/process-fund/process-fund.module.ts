import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessFundPageRoutingModule } from './process-fund-routing.module';

import { ProcessFundPage } from './process-fund.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessFundPageRoutingModule
  ],
  declarations: [ProcessFundPage]
})
export class ProcessFundPageModule {}
