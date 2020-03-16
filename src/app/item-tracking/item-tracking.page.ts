import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Shipment } from './shipment.model';
import { RequestService } from '../services/request.service';
import { FullRequest } from '../new-request/full-request.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-item-tracking',
  templateUrl: './item-tracking.page.html',
  styleUrls: ['./item-tracking.page.scss'],
})
export class ItemTrackingPage implements OnInit {

  ref: string;
  shipment: Shipment
  fullRequest: FullRequest;
  constructor(private router: Router,
              private requestService: RequestService,
              private toastController: ToastController) { }

  ngOnInit() {
  }
  onCancel() {
    this.router.navigateByUrl('/inside');
  }

  onSubmit(f: NgForm){
    console.log(f.value.ref);
    this.ref = f.value.ref;
  // verify ref number
    
  this.fullRequest = this.requestService.getRequest(this.ref);
  console.log(this.fullRequest);
  if (!this.fullRequest.pickupRef) {
    this.presentToast();
    return;
  }
  else{
    console.log('Parcel Found!');
  }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Invalid reference number! Please try again.',
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
