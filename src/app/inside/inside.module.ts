import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsidePageRoutingModule } from './inside-routing.module';

import { InsidePage } from './inside.page';
import { CityComponent } from './city/city.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsidePageRoutingModule
  ],
  declarations: [InsidePage, CityComponent],
  entryComponents: [CityComponent]
})
export class InsidePageModule {}
