import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartAlaaruPageRoutingModule } from './start-alaaru-routing.module';

import { StartAlaaruPage } from './start-alaaru.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartAlaaruPageRoutingModule
  ],
  declarations: [StartAlaaruPage]
})
export class StartAlaaruPageModule {}
