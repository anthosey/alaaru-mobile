import { Component, OnInit, Input } from '@angular/core';
import { User } from '../auth/model/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit {
  @Input() user: User

  constructor(private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {}

  onLogout() {
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging out..', spinner: 'lines'})
    .then(loadingEl => {
      loadingEl.present();
      this.authService.logout()
      .subscribe(data => {
        loadingEl.dismiss()
        this.router.navigateByUrl('/auth');
      }, err => {
        loadingEl.dismiss()
          this.presentToastCongnitoError(err.message)
      })
    })


    
    
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

  startAlaaru() {
    this.router.navigateByUrl('/start-alaaru/addresses');
  }
}
