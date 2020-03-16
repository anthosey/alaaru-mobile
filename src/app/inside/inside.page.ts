import { Component, OnInit, OnDestroy } from '@angular/core';
// import { User } from '../auth/model/user.model';
import { AuthService } from '../services/auth.service';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { CityComponent } from './city/city.component';
import { City } from './city.model';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { FullRequest } from '../new-request/full-request.model';
import { AuthUSer } from '../auth/model/auth-user.model';
import { Subscription } from 'rxjs';
import { ServiceTypes } from '../new-request/model/service.model';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
user: AuthUSer;
user2: string;
cities: City[];
logisticsType: string;

apiResData: any;
transactions: FullRequest[] = [];
items: any[];
itemSub: Subscription;
services: ServiceTypes [];
  constructor(private authService: AuthService,
              private actionSheetController: ActionSheetController,
              private modalCtrl: ModalController,
              private requestService: RequestService,
              private router: Router,
              private toastController: ToastController) { }

  ngOnInit() {
    this.cities = this.requestService.getCities();
    this.user = this.authService.getLoggedInUser();
    // this.itemSub = this.requestService.testBackend().subscribe(data => {
    //   console.log('reS: ' + data.data);
    // })

    this.requestService.fetchServices().subscribe (data => {
      console.log('Services: '+ data);
      this.services = data;  
    })
  }
  
  
ionViewDidEnter() {
  // console.log('DidEnter: ' + this.authService.userIsAuthenticated);
    
    // console.log('user:' + this.user.firstName);
    this.transactions = this.requestService.getRequests();
}

async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Choose area of Operation',
    cssClass: 'actionSheet',
    buttons: [{
      text: 'Within a city',
      role: 'destructive',
      icon: 'home',
      handler: () => {
        // Check if user have a saved City in his profile
        // if not, Call modal
        this.modalCtrl.create({
          component:CityComponent,
          componentProps:{cities: this.cities },
          id: 'cityModal'}).then(modalEl =>{
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(resultData => {
          console.log(resultData.data.cityOption + ', ' + resultData.data.saveCitySelection);

          if (resultData.role === 'confirm'){
            if (!resultData.data.cityOption) {
              // show a toast
              this.presentToast();
            return;
            }
            this.logisticsType = 'Within city';
            this.requestService.setLogisticsType ('Within city');
            this.router.navigateByUrl('/vehicle-types')
            
          }
        })

        console.log('within city selected');
      }
    }, {
      text: 'Inter-city',
      icon: 'planet',
      handler: () => {

        console.log('Inter city selected');
        this.logisticsType = 'Inter-city';
        this.requestService.setLogisticsType ('Inter-city');
        this.router.navigateByUrl('/new-request/inter-city')
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

async presentToast() {
  const toast = await this.toastController.create({
    message: 'You need to select a city, Please start again',
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

onViewPayment() {
  console.log('goto payment!');
}


onViewDetails(ref: string) {
  console.log('View Details' + ref);
// Get one request with Id
}
}
