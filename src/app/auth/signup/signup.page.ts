import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from '../model/user.model';
import { map } from 'rxjs/operators';
import { Auth } from 'aws-amplify';
import { RequestService } from 'src/app/services/request.service';
import { Country } from '../model/country';
import { AirtimeService } from 'src/app/services/airtime.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})


export class SignupPage implements OnInit, OnDestroy {
user: any;
users: User[];
country: Country;
mobile: string;
phoneCode;
private signupSub: Subscription;
  constructor(private router: Router,
              private authService: AuthService,
              private requestService: RequestService,
              private airtimeService: AirtimeService,
              private toastController: ToastController,
              private loadingCtrl: LoadingController) { }

  
  ngOnInit() {
  }

  onSignin() {
    this.router.navigateByUrl('/auth');
  }

  ionViewDidEnter() {
    this.country = this.requestService.getOneCountry();
    this.phoneCode = this.country.phoneCode;
  }

onSignup(f: NgForm) {
  this.loadingCtrl.create({keyboardClose: true, message: 'Signing up..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();

    this.verifyNumber (f.value.mobile);
    if (!this.mobile) {
      loadingEl.dismiss();
      return} // mobile number

    this.user = new User('', f.value.password, f.value.email, this.mobile, f.value.firstName, '', 500, 'Abuja Nigeria');
    
  this.signupSub = this.authService.signup(this.user)
    .subscribe (data => {
      loadingEl.dismiss();
      this.authService.userName = data.username;
      if (data.status) { this.router.navigateByUrl('/auth')}
      else {this.router.navigateByUrl('/email-verify');}
    },
    err => {
      loadingEl.dismiss();
      this.presentToastCongnitoError(err.message);
    });
  })
}

verifyNumber(num: string) {
    const nums = num + "";
    console.log(num + ',' + nums.length);
     if (this.phoneCode === '+234' && nums.length !== 10) {
    console.log('invalid')
      this.presentToast();
      return;
    }
      console.log('valid');
      let numCode = '0' + nums.substring(0,3);
      const ans = this.airtimeService.verifyNetwork(numCode);
      if (ans) {
        this.mobile = this.phoneCode + num;
      } else if (this.phoneCode !=='+234') { // Do not regard network provide check if not in Nigeria
        this.mobile = this.phoneCode + num;
      } else {
        this.presentToast2();
        return;
      }
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Invalid mobile number, please use format: +2348012345678',
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


async presentToastCongnitoError(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 5000,
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

ngOnDestroy() {
  if (this.signupSub) {
    this.signupSub.unsubscribe();
  }
}
}
