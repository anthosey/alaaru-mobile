import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private toastController: ToastController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onChangePassword(f: NgForm) {
    this.loadingCtrl.create({keyboardClose: true, message: 'Please wait..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();

    this.authService.changePassword(f.value.oldPassword, f.value.newPassword)
    .subscribe(data => {
      loadingEl.dismiss();
      if (data === 'SUCCESS') {
        this.presentToastCongnitoInfo('Password changes successfully!');
      }
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
