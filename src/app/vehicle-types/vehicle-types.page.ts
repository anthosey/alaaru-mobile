import { Component, OnInit } from '@angular/core';
import { VehicleTypes } from './vehicle.model';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { IonRadio, IonRadioGroup, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicle-types',
  templateUrl: './vehicle-types.page.html',
  styleUrls: ['./vehicle-types.page.scss'],
})
export class VehicleTypesPage implements OnInit {

  constructor(private requestService: RequestService,
              private router: Router,
              private toastController: ToastController) { }
  vehicleTypes: VehicleTypes[];
  vehicleOption: string;
  fullVehicleCapacity =false;
  logisticsType: string;
  ngOnInit() {
    this.vehicleTypes = this.requestService.getAllVehicles();
    this.logisticsType = this.requestService.logisticsType;
    console.log('init :' + this.logisticsType);
  }

  ionViewWillEnter() {
    this.logisticsType = this.requestService.logisticsType;
    console.log('WillEnter:' + this.logisticsType);
    this.vehicleTypes = [];
  }
  ionViewDidEnter() {

    this.vehicleTypes = this.requestService.getAllVehicles();
    
    if (this.logisticsType === 'Inter-city') {
      this.vehicleTypes = this.requestService.getAllVehicles_withoutBike();
    }
    console.log('1st Vehicle' + this.vehicleTypes[0].vehicleType);
    console.log('XX: ' + this.vehicleTypes[1].allowFullVehicleCapacity);
    console.log('DidEnter:' + this.logisticsType);
  }

  onChange(vehicle: IonRadioGroup) {
    this.vehicleOption = vehicle.value;
    console.log('Choice: ' + vehicle.value);
    if (this.vehicleOption === 'Bike') {
      this.fullVehicleCapacity = false;
      this.requestService.setVehicleCapacity(false);
    }
  }

  onProceed() {
    if (!this.vehicleOption) {
      // this.presentToastWithOptions();
      this.presentToast();
      return;
    }
    this.requestService.setVehicleOption(this.vehicleOption);
    this.router.navigate(['/new-request']);
    // this.router.navigate(['/new-request/description']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Please select a vehicle type first.',
      duration: 2000,
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
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      // header: 'Rent vehicle',
      message: 'Rent full capacity selected',
      position: 'top',
      color: 'secondary',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          text: 'Remove it',
          handler: () => {
            this.fullVehicleCapacity = false;
            console.log('Rent Full Capacity ' + this.fullVehicleCapacity);
            this.requestService.setVehicleCapacity(false);
          }
        // }, 
        // {
        //   side: 'end',
        //   text: 'Cancel',
        //   role: 'cancel',
        //   handler: () => {
        //     // this.fullVehicleCapacity = false;
        //     console.log('Service cancelled! '); //+ this.fullVehicleCapacity);
        //   }
        }
      ]
    });
    toast.present();
  }

  onClick() {
    this.fullVehicleCapacity = true;
    console.log(this.fullVehicleCapacity);
    this.requestService.setVehicleCapacity(this.fullVehicleCapacity); // Set the status of fullVehicleCapacity
    this.presentToastWithOptions();
  }
  
  onRemoveFullCapacity() {
    this.fullVehicleCapacity = false;
    console.log('Rent Full Capacity ' + this.fullVehicleCapacity);
    this.requestService.setVehicleCapacity(false);

  }
}
