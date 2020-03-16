import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleTypesPageRoutingModule } from './vehicle-types-routing.module';

import { VehicleTypesPage } from './vehicle-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleTypesPageRoutingModule
  ],
  declarations: [VehicleTypesPage]
})
export class VehicleTypesPageModule {}
