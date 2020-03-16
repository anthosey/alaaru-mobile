import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private toastController: ToastController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onResetPassword(f) {
    this.loadingCtrl.create({keyboardClose: true, message: 'Please wait..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();

    this.authService.preResetCheck(f.value.username)
    .subscribe(data => {
      loadingEl.dismiss();
        this.presentToastCongnitoInfo('email confirmed');
        this.authService.username = f.value.username;
      this.router.navigateByUrl('/reset-confirm');
    },
    err => {
      loadingEl.dismiss();
      this.presentToastCongnitoError(err.message);
    })
  });
}

  async presentToastCongnitoError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
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

  
  async presentToastCongnitoInfo(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
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
