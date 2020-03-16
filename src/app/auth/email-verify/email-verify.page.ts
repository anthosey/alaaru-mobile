import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.page.html',
  styleUrls: ['./email-verify.page.scss'],
})
export class EmailVerifyPage implements OnInit {
 username: string;
  constructor(private authService: AuthService,
              private toastController: ToastController,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.username = this.authService.userName;
  }
  onVerify(f: NgForm) {
    console.log(f);
    console.log(f.value.verificationCode);
    this.authService.verifyAccount(this.username, f.value.verificationCode)
    .subscribe(data => {
      console.log(data);
      if (data === 'SUCCESS') {
        this.router.navigateByUrl('/auth');
      }
    },
    err => {
      console.log('erro Fromt: ' + err.message);
      this.presentToastCongnitoError(err.message);
    });
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

  onResend() {
    this.authService.resendVerificationCode(this.username)
    .subscribe(data => {
      console.log(data);
      this.presentToastSuccess('code resent successfully');
    }, 
    err => {
      console.log('Error fromt: ' + err.message);
      this.presentToastCongnitoError(err.message);
    })
  }

  async presentToastSuccess(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'dark',
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

