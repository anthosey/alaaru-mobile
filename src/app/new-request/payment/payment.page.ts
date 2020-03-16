import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

interface ResData {
  message: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, OnDestroy {
quote = 0;
wallet = 0;
paySubscr: Subscription;
x: Subscription;
title;
reference = '';
data: ResData;


constructor(
  private requestService: RequestService,
  private router: Router,
  private inAppBrowser: InAppBrowser) { }

  ngOnInit() {
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.quote = this.requestService.fetchEstimate();
  }

  openBrowser() {
    // await Browser.open({ url: 'https://alaaru.herokuapp.com/' });
    this.x = this.requestService.callPaystack()
    .subscribe(data => {
      console.log(data.status);
      // console.log(data.data[0].category);
    });
  }

  ngOnDestroy() {
//     if (this.paySubscr) {
//     this.paySubscr.unsubscribe();

//     if (this.x) {
//       this.x.unsubscribe();
//     }
// }
  }

  paymentInit() {
    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';
    console.log(this.title, ref);
  }

  paymentCancel() {
    console.log('payment failed');
  }

}
