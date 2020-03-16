import { Component, OnInit } from '@angular/core';
import { Airtime } from './airtime.model';
import { NgForm } from '@angular/forms';
import { IonSelect, ToastController } from '@ionic/angular';
import { AirtimeService } from '../services/airtime.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-airtime',
  templateUrl: './buy-airtime.page.html',
  styleUrls: ['./buy-airtime.page.scss'],
})


export class BuyAirtimePage implements OnInit {
transaction: Airtime;
mobile: string;
amount: number;
ref: string;
status: string;
networkProvider: string;
  countryOptionCtrl ='+235';
  constructor(private airtimeService: AirtimeService,
              private router: Router,
              private toastController: ToastController) { }

  ngOnInit() {
  }

  onProceed(f: NgForm) {
    this.mobile = f.value.phone;// + f.value.phone;
    console.log('num ' + this.mobile);
    this.amount = f.value.amount;
    console.log('amount:' + this.amount)    ;
    this.verifyNumber(this.mobile);
  }

verifyNumber(num: string) {
// console.log(num.charAt(1));
const nums = num + "";

// if (num.le
console.log(num + ',' + nums.length);
if (nums.length !== 10) {
  console.log('invalid')
  // this.networkProvider = 'invalid';
  this.presentToast();

} else {
  console.log('valid');
  let numCode = '0' + nums.substring(0,3);
  const ans = this.airtimeService.verifyNetwork(numCode);
  if (ans) {
    this.airtimeService.mobile = '+234' + this.mobile;
    this.airtimeService.amount = this.amount;
    this.networkProvider = 'valid';
    this.router.navigateByUrl('/buy-airtime/process-airtime');
  } else {
    this.presentToast2();
  }
  
}

}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Invalid mobile number, please use format: 08012345678',
    duration: 3000,
    color: 'danger',
    position: 'bottom',
    buttons: [
      {
        side: 'start',
        icon: 'alert'
      }
    ]
  });
  toast.present();
}

async presentToast2() {
  const toast = await this.toastController.create({
    message: 'Unrecognized network provider!',
    duration: 3000,
    color: 'danger',
    position: 'bottom',
    buttons: [
      {
        side: 'start',
        icon: 'alert'
      }
    ]
  });
  toast.present();
}
}