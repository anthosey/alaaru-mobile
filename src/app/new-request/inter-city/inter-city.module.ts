import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterCityPageRoutingModule } from './inter-city-routing.module';

import { InterCityPage } from './inter-city.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterCityPageRoutingModule
  ],
  declarations: [InterCityPage]
})
export class InterCityPageModule {}
