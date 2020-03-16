import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CostReviewPageRoutingModule } from './cost-review-routing.module';

import { CostReviewPage } from './cost-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CostReviewPageRoutingModule
  ],
  declarations: [CostReviewPage]
})
export class CostReviewPageModule {}
