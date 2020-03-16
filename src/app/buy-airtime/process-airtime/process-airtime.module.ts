import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessAirtimePageRoutingModule } from './process-airtime-routing.module';

import { ProcessAirtimePage } from './process-airtime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessAirtimePageRoutingModule
  ],
  declarations: [ProcessAirtimePage]
})
export class ProcessAirtimePageModule {}
