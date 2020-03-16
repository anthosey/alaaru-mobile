import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { User } from 'src/app/auth/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { IonToggle } from '@ionic/angular';
import { AuthUSer } from 'src/app/auth/model/auth-user.model';

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {
  pickupContactSwitchState = false;
  deliveryContactSwitchState = false;
  
  logisticsType : string;
  interstate_ServiceOption: string;

  interstateCityFrom: string;
  interstateCityTo: string;
  fullVehicleCapacity= false;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private authService: AuthService) { }
 quote = 0;
 loggedInUser: AuthUSer;
 name: string;
 mobile: string;
 email: string;

 name2: string;
 mobile2: string;
 email2: string;
  ngOnInit() {
    this.quote = this.requestService.fetchEstimate();
    // this.loggedInUser = this.authService.getLoggedInUser();
  }

  ionViewDidEnter() {
    this.quote = +this.requestService.fetchEstimate();
    console.log('Desc Quote:' + this.quote);
    this.logisticsType = this.requestService.logisticsType;
    this.interstate_ServiceOption = this.requestService.interstateServiceOption;
    // this.map = new google.maps.Map(document.getElementById('map'), {
    //   center: { lat: -34.9011, lng: -56.1645 },
    //   zoom: 15
    // });
  }

onSubmit(f: NgForm) {
  this.requestService.keepDescription(f.value.itemDescription,
    f.value.pickupContactName,
    f.value.pickupContactMobile,
    f.value.pickupContactEmail,
    f.value.deliveryContactName,
    f.value.deliveryContactMobile,
    f.value.deliveryContactEmail,
    this.quote);
  console.log(f);

  // Get Item
  const item = this.requestService.getDescription();
  // Get Mini request
  const mini = this.requestService.getMiniRequest();
  console.log('Item: ' + item);
  console.log('mini: 0' + mini);
  //return;

  // this.logisticsType = '';
  // this.interstate_ServiceOption = '';
  this.interstateCityFrom = this.requestService.interstateCityFrom;
  this.interstateCityTo=this.requestService.interstateCityTo;
  this.fullVehicleCapacity = this.requestService.fullVehicleCapacity;
  // Submit Request
  this.requestService.submitRequest(this.logisticsType, this.interstate_ServiceOption, 
    this.interstateCityFrom, this.interstateCityTo, this.fullVehicleCapacity, 
    mini.pickupAddress, mini.deliveryAddress,
    mini.weight, mini.worth, mini.serviceOption, mini.pickupTime,
    mini.deliveryTime, mini.pickupLat, mini.pickupLng,
    mini.deliveryLat, mini.deliveryLng, item.itemDescription,
    item.pickupContactPerson, item.pickupContactMobile, item.pickupContactEmail,
    item.deliveryContactPerson, item.deliveryContactMobile,
    item.deliveryContactEmail, item.amount, '12344321', 'Unpaid', 'Waiting','user', '123','nobody');

    this.router.navigate(['/inside']);
  // this.router.navigate(['/new-request/payment']);

}

getUserContactInfo(cI: IonToggle) {
  if (cI.checked) {
    this.pickupContactSwitchState = true;
  this.name = this.loggedInUser.firstName;
  this.mobile = this.loggedInUser.mobile;
  this.email = this.loggedInUser.email;
}else {
  this.pickupContactSwitchState = false;
  this.name = '';
  this.mobile = '';
  this.email = '';
}

}


getUserContactInfo_delivery(cI: IonToggle) {
  if (cI.checked) {
    this.deliveryContactSwitchState = true;
  this.name2 = this.loggedInUser.firstName;
  this.mobile2 = this.loggedInUser.mobile;
  this.email2 = this.loggedInUser.email;
}else {
  this.deliveryContactSwitchState = false;
  this.name2 = '';
  this.mobile2 = '';
  this.email2 = '';
}

}
}