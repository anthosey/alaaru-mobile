import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-confirm',
  templateUrl: './reset-confirm.page.html',
  styleUrls: ['./reset-confirm.page.scss'],
})
export class ResetConfirmPage implements OnInit {

  constructor(private authService: AuthService,
              private toastController: ToastController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onResetPassword(f) {
    const code = f.value.code;
    const password = f.value.password;
    const username = this.authService.username;

    this.loadingCtrl.create({keyboardClose: true, message: 'Please wait..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();

    this.authService.resetPassword(username,code, password)
    .subscribe(data => {
      loadingEl.dismiss();
      this.presentToastCongnitoInfo('Password reset completed successfully!');
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
