import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemTrackingPageRoutingModule } from './item-tracking-routing.module';

import { ItemTrackingPage } from './item-tracking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemTrackingPageRoutingModule
  ],
  declarations: [ItemTrackingPage]
})
export class ItemTrackingPageModule {}
