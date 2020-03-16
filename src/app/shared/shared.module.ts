import { NgModule } from "@angular/core";
import { WebPaymentComponent } from './payments/web-payment/web-payment.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [WebPaymentComponent],
    exports: [WebPaymentComponent],
    imports: [CommonModule, FormsModule, IonicModule],
    entryComponents:[WebPaymentComponent]
})
export class SharedModule {}