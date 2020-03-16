import { Component, OnInit } from '@angular/core';
import { IonRadio, IonSelect, ToastController } from '@ionic/angular';
import { City } from 'src/app/inside/city.model';
import { RequestService } from '../../services/request.service';
import { CityServices } from './cityServices.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inter-city',
  templateUrl: './inter-city.page.html',
  styleUrls: ['./inter-city.page.scss'],
})
export class InterCityPage implements OnInit {

  constructor(private requestService: RequestService,
              private toastController: ToastController,
              private router: Router) { }
  note: string;
  cityFrom: string;
  cityTo: string;
  cityFromDoorStatus;
  cityToDoorStatus;
  cities: City [];
  city: City;
  city2: City;
  cityServices: CityServices[];
  cityService: string;
  ngOnInit() {
    this.cities = this.requestService.getCities();
  }

  onChange(rdo: IonRadio) {
    console.log('Service: ' + rdo.value);
    this.cityService = rdo.value;
    if (rdo.value === 'doorToDoor') { this.note = `We shall pickup from your location in ${this.cityFrom} and also deliver to your location in ${this.cityTo}`}
    else if (rdo.value === 'destinationOnly') {this.note = `You will bring the item to our office in ${this.cityFrom}, then We shall deliver to your address in ${this.cityTo}.`}
    else if (rdo.value === 'pickupOnly') {this.note = `We shall pickup from your location in  ${this.cityFrom} then drop off at our office in ${this.cityTo}`}
    else if (rdo.value === 'interstateOnly') {
      this.note = `You will bring the item to our office in ${this.cityFrom}, then We shall drop off at our office in ${this.cityTo} `}
    else {this.note === ''}
  }

  
  onChangeCityFrom(cityCtr: IonSelect) {
    this.cityFrom = cityCtr.value;
    this.city = this.requestService.getCity(this.cityFrom);
    console.log('cityFrom:' + this.cityFrom);
    console.log('Status: ' + this.city.doorToDoor);
    if (this.cityTo) {
      this.city2 = this.requestService.getCity(this.cityTo);
      this.cityServices = this.requestService.loadCityServices(this.city.doorToDoor, this.city2.doorToDoor);
    }

    // Check and list services available

  }

  onChangeCityTo(cityCtr: IonSelect) {
    this.cityTo = cityCtr.value;
    this.city2 = this.requestService.getCity(this.cityTo);
    console.log('cityTo:' + this.cityTo);
    console.log('Status: ' + this.city2.doorToDoor);
    if (this.cityFrom) {
      this.city = this.requestService.getCity(this.cityFrom);
      this.cityServices = this.requestService.loadCityServices(this.city.doorToDoor, this.city2.doorToDoor);

    }

  }

  onSubmit(f: NgForm){
    if (!this.cityService) {
      this.presentToast();
      return;
    }

    this.requestService.setInterStateProperties(this.cityService, f.value.cityFrom, f.value.cityTo);
    console.log(this.cityService, f.value.cityFrom, f.value.cityTo);
    if (this.cityService === 'interstateOnly') {
      this.router.navigateByUrl('/new-request');
    } else {
      this.router.navigateByUrl('/vehicle-types');
    }
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Please choose a service first.',
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

}
