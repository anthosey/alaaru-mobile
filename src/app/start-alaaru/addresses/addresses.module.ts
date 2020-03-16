import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressesPageRoutingModule } from './addresses-routing.module';

import { AddressesPage } from './addresses.page';
import { AddressPickerComponent } from '../address-picker/address-picker.component';
import { VehiclePickerComponent } from '../vehicle-picker/vehicle-picker.component';
import { ContactPersonComponent } from '../contact-person/contact-person.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressesPageRoutingModule,
    SharedModule
  ],
  declarations: [AddressesPage, 
                AddressPickerComponent, 
                VehiclePickerComponent,
                ContactPersonComponent],
  entryComponents:[AddressPickerComponent, 
                  VehiclePickerComponent,
                  ContactPersonComponent]
})
export class AddressesPageModule {}
