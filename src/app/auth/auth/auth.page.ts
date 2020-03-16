import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import { Country } from '../model/country';
import { RequestService } from 'src/app/services/request.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
countries: Country[];
country= "Nigeria";
countryCode = "ng";
flagUrl ="assets/img/nigeria.svg";
loginAttempt = 1;
  constructor(private authService: AuthService,
              private router: Router,
              private actionSheetController: ActionSheetController,
              private requestService: RequestService,
              private toastController: ToastController,
              private loadingController: LoadingController
            ) { }

  ngOnInit() {
    this.countries = this.requestService.getCountries();
  }

  onLogin(f: NgForm) {
    this.loadingController.create({keyboardClose: true, message: 'Loggin in..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();
      this.authService.login(f.value.username, f.value.password)
      .subscribe(data => {
        f.reset();
        console.log('login..' + data);
        loadingEl.dismiss();
        // if (data === 'SUCCESS') { this.router.navigateByUrl('/inside');}
        if (data) { this.router.navigateByUrl('/start-alaaru/addresses');}
      },
      err => {
        loadingEl.dismiss();
        this.presentToastCongnitoError(err.message);
      })
    })
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  onReset() {
    this.router.navigateByUrl('/reset-password');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      
      header: 'Select your Country',
      cssClass: 'actionSheet',
      buttons: [{
        text: 'Nigeria',
        role: 'destructive',
        icon: 'assets/img/nigeria.svg',
        handler: () => {
          this.country = "Nigeria",
          this.countryCode = 'ng';
          this.flagUrl='assets/img/nigeria.svg'
          this.requestService.setCountry(this.countryCode);
          console.log('Nigeria Selected');
        }
      }, {
        text: 'Ghana',
        icon: 'assets/img/ghana.svg',
        handler: () => {
  
          this.country = "Ghana",
          this.countryCode = 'gh';
          this.flagUrl='assets/img/ghana.svg'
          this.requestService.setCountry(this.countryCode);
          console.log('Ghana selected');
          
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentToastCongnitoError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
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
