import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperationsInitialPageRoutingModule } from './operations-initial-routing.module';

import { OperationsInitialPage } from './operations-initial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperationsInitialPageRoutingModule
  ],
  declarations: [OperationsInitialPage]
})
export class OperationsInitialPageModule {}
