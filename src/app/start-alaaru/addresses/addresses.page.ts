import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Geocoder, ReverseGeocoder } = Plugins;
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, ModalController, ToastController, LoadingController } from '@ionic/angular';
//import { AuthUSer } from 'src/app/auth/model/auth-user.model';
import { AuthUSer } from '../../auth/model/auth-user.model';

import { dayStyle } from '../map-styles';
import { nightStyle } from '../night-map-styles';
import { AddressPickerComponent } from '../address-picker/address-picker.component';
import { VehiclePickerComponent } from '../vehicle-picker/vehicle-picker.component';
import { ContactPersonComponent } from '../contact-person/contact-person.component';
import { WebPaymentComponent } from '../../shared/payments/web-payment/web-payment.component';
import { OnlineUsers } from 'src/app/model/online-user';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { VehicleTypes } from 'src/app/vehicle-types/vehicle.model';




@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild("map") mapElement; 
  map: any;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  pickupAddress: string;
  pickupCity: string;
  deliveryAddress: string;
  deliveryCity: string;

  mStyle = [];
  user: AuthUSer;
  serviceType = "Instant pickup";
  weight = 1;
  itemDescription: string;
  worth: number;
  vehicleType: string;
  vehicle: VehicleTypes;
  amount: number;
  changeToRegular = false;
  accuracy: number;
  speed: number;
  ETA: number;
  vehicleImage: string;
  pickupFromMe = true;
  deliverToMe = true;
  interstate = "No";
  // Page changing properties
  backHome = true;
  addressSet = false;
  vehicleSelected = false;
  requestConfirmed = false;
  pictureEnlarged = false;
  // End of page changing proeprties

  pickupContactPerson: string;
  pickupContactPersonMobile: string;
  pickupContactPersonEmail: string;

  deliveryContactPerson: string;
  deliveryContactPersonMobile: string;
  deliveryContactPersonEmail: string;
  ref: string;
  driver: OnlineUsers;
  onlineDrivers: OnlineUsers[] = [];
  backButtonSubscription; 


  // Testing Location tracking
  currentMapTrack = null;
 
  isTracking = false;
  trackedRoute = [];
  previousTracks = [];
 
  positionSubscription: Subscription;
  // End Location tracking

  marker: any;
  markers: any[] = [];
  constructor(private requestService: RequestService,
    public zone: NgZone,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private modalCtr: ModalController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private callNumber: CallNumber,
    private platform: Platform) { }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    
    this.pickupUseMyContact();
    this.deliveryUseMyContact();  

    return;
  }

  pickupUseMyContact() {
    this.deliveryContactPerson = this.user.firstName;
    this.pickupContactPersonEmail = this.user.email;
    this.pickupContactPersonMobile = this.user.mobile;
  }

  deliveryUseMyContact() {
    this.pickupContactPerson = this.user.firstName;
    this.deliveryContactPersonEmail = this.user.email;
    this.deliveryContactPersonMobile = this.user.mobile;
  }

  isNight(){
    //Returns true if the time is between
    //7pm to 5am
    let time = new Date().getHours();
    // time = 22;
    return (time > 5 && time < 19) ? false : true;
  }


  
  // async getCurrentLocation() {
    async getCurrentLocation() {
    
    const coordinates = await this.geolocation.getCurrentPosition({enableHighAccuracy: true});
      this.pickupLat = coordinates.coords.latitude;
      this.pickupLng = coordinates.coords.longitude;
      this.accuracy = coordinates.coords.accuracy;
      this.speed = coordinates.coords.speed;
      console.log('Location' + coordinates.coords.latitude + ',' + coordinates.coords.longitude, 'Speed: ' + this.speed);
  
      if(this.isNight()){
        this.mStyle = nightStyle 
      } else { this.mStyle = dayStyle}

    this.mStyle = dayStyle; //use only day style for now
    
    this.map = new google.maps.Map(document.getElementById('map'), {

      // this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.pickupLat, lng: this.pickupLng },
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: this.mStyle,
      // zoomControl: true,
      // zoomControlOptions: {
      // position: google.maps.ControlPosition.RIGHT_CENTER
      // }

    });

    // this.marker = new google.maps.Marker({
    //   map: this.map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP,
    //   position: {lat: this.pickupLat, lng: this.pickupLng},
    //   icon: { path: google.maps.SymbolPath.CIRCLE,
    //     scale: 10
    //   }
    // });
    // this.marker.addListener('click', this.toggleBounce);
  
  
    // load online drivers
    this.onlineDrivers = this.requestService.onlineUsers;
    this.addMarkers(this.onlineDrivers);

  }

  toggleBounce() {
    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  
  // Direction Service Starts here
  initMap() {
    
    var pointA = new google.maps.LatLng(this.pickupLat, this.pickupLng),
      pointB = new google.maps.LatLng(this.deliveryLat, this.deliveryLng),
      // centerPoint = new google.maps.LatLng(9.0602711,7.4566257),
      myOptions = {
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: this.mStyle,
        center: pointA
      },
      map = new google.maps.Map(document.getElementById('map'), myOptions),
      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService,
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      }),
      markerA = new google.maps.Marker({
        position: pointA,
        // title: "point A",
        // label: "A",
        map: map,
        icon: 'assets/img/marker.png'
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        // title: "point B",
        // label: "B",
        map: map,
        icon: 'assets/img/marker.png'
      });

    // get route from A to B
    this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      console.log('status: ' + status);
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  // Direction Service ends here

  ionViewDidEnter() {
    // Get current user location
    // this.user = this.authService.getLoggedInUser();
    // console.log(this.user);
    this.getCurrentLocation();
    //Set latitude and longitude of some place

  }

  

  loadAddress() {
    this.modalCtr.create({component: AddressPickerComponent, componentProps:{lat: this.pickupLat, lng: this.pickupLng}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      this.pickupLat = resultData.data.pickLat;
      this.pickupLng = resultData.data.pickLng;
      this.deliveryLat =  resultData.data.delLat;
      this.deliveryLng = resultData.data.delLng;
      this.pickupCity = resultData.data.pickupCity;
      this.deliveryCity = resultData.data.deliveryCity;
      this.deliveryAddress = resultData.data.deliveryAddress;
      this.pickupAddress = resultData.data.pickupAddress;

      this.addressSet = true;
      this.backHome = false;
      this.vehicleSelected = false;

      console.log('Answers: ' + this.pickupLat, this.pickupLng, this.deliveryLat, this.deliveryLng);

      // Check selected cities against city of operations
      const tempPickupCity = this.requestService.confirmCityWeOperateIn(this.pickupCity).cityName;
      const tempDeliveryCity = this.requestService.confirmCityWeOperateIn(this.deliveryCity).cityName;
      console.log('TestCity:' + tempPickupCity + ',' + tempDeliveryCity);
      if (!tempPickupCity || !tempDeliveryCity) {
        this.presentToast();
        this.addressSet = false;
        this.backHome = true;
        this.vehicleSelected = false;

        return;
      } else {
        this.initMap();
      }
      
    })
  }

 
  proceed() {
    console.log(this.weight, this.itemDescription, this.worth, this.serviceType);
    // call vehicle option component
    this.modalCtr.create({component: VehiclePickerComponent, 
      componentProps:{weight: this.weight, serviceType: this.serviceType, pickupLat: this.pickupLat, pickupLng: this.pickupLng}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      this.vehicleType = resultData.data.vehicleType;
      this.amount = resultData.data.amount;
      this.changeToRegular = resultData.data.changeToRegular;
      this.ETA = resultData.data.ETA;
      this.vehicleSelected = resultData.data.vehicleSelected;
      this.vehicleType = resultData.data.vehicleType;
      this.vehicleImage = resultData.data.vehicleImage;
      this.addressSet = false;
      this.backHome = false;

      if (this.changeToRegular) { this.serviceType = 'Standard'}
      console.log('Answers: ' + this.vehicleType, this.amount);
      // Set a variable to display other things and hide some others
    })

  }

  onBack() {
    this.backHome = true;
    this.addressSet = false;
    this.vehicleSelected = false
    this.getCurrentLocation();
  }

  onClearVehicleSelection() {
    this.vehicleSelected = false;
    this.backHome = false;
    this.addressSet = true;
  }

  changePickupFromMe() {
    this.pickupFromMe = !this.pickupFromMe;

    console.log(this.pickupFromMe);
    this.modalCtr.create({component: ContactPersonComponent, 
      componentProps: {pickupFromMe: this.pickupFromMe, deliverToMe: this.deliverToMe}})
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      this.pickupContactPerson = resultData.data.pickupContactPerson;
      this.pickupContactPersonMobile = resultData.data.pickupContactPersonMobile;
      this.pickupContactPersonEmail = resultData.data.pickupContactPersonEmail;
      this.pickupFromMe = resultData.data.pickupFromMe;

      this.deliveryContactPerson = resultData.data.deliveryContactPerson; 
      this.deliveryContactPersonMobile = resultData.data.deliveryContactPersonMobile;
      this.deliveryContactPersonEmail = resultData.data.deliveryContactPersonEmail;
      this.deliverToMe = resultData.data.deliverToMe;

      
    })
    if (this.pickupFromMe) {
      this.pickupUseMyContact();
    }

    if (this.deliverToMe) {
      this.deliveryUseMyContact();
    }

  }

  changeDeliverToMe() {
    this.deliverToMe = !this.deliverToMe;
    this.modalCtr.create({component: ContactPersonComponent, 
      componentProps: {pickupFromMe: this.pickupFromMe, deliverToMe: this.deliverToMe}})
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      this.pickupContactPerson = resultData.data.pickupContactPerson;
      this.pickupContactPersonMobile = resultData.data.pickupContactPersonMobile;
      this.pickupContactPersonEmail = resultData.data.pickupContactPersonEmail;
      this.pickupFromMe = resultData.data.pickupFromMe;

      this.deliveryContactPerson = resultData.data.deliveryContactPerson; 
      this.deliveryContactPersonMobile = resultData.data.deliveryContactPersonMobile;
      this.deliveryContactPersonEmail = resultData.data.deliveryContactPersonEmail;
      this.deliverToMe = resultData.data.deliverToMe;
     
    })
    if (this.pickupFromMe) {
      this.pickupUseMyContact();
    }

    if (this.deliverToMe) {
      this.deliveryUseMyContact();
    }
    console.log('after:'+ this.pickupContactPerson, this.deliveryContactPerson);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose a type of pickup',
      cssClass: 'actionSheet',
      buttons: [{
        text: 'Instant pickup',
        role: 'destructive',
        icon: 'stopwatch',
        handler: () => {
          console.log('Instant selected');
          this.serviceType = 'Instant pickup'
        }
      }, {
        text: 'Standard : (Pickup within 24 hours)',
        icon: 'hourglass',
        handler: () => {

          console.log('Standard selected');
          this.serviceType = 'Standard'
          // this.router.navigateByUrl('/new-request/inter-city')
        }
      },

      {
        text: 'Schedule',
        icon: 'timer',
        handler: () => {

          console.log('Schedule selected');
          this.serviceType = '15-02-2010 15:00:00'
          // this.router.navigateByUrl('/new-request/inter-city')
        }
      },
      {
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
      message: 'Services unavailable in your selected city',
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

  confirmRequest() {
    console.log('Confirm request...');
    if (this.pickupCity != this.deliveryCity) {this.interstate = "Yes"} else { this.interstate = "No"}
    if (this.requestService.cardActive) {
      console.log('Yes!, Card active');
      // Submit Transaction     
        this.requestService.submitRequest('default',this.interstate, this.pickupCity, this.deliveryCity, false, this.pickupAddress,
        this.deliveryAddress, this.weight, this.worth, this.serviceType, new Date(), new Date(), this.pickupLat, this.pickupLng,
        this.deliveryLat, this.deliveryLng, this.itemDescription, this.pickupContactPerson, this.pickupContactPersonMobile,
        this.pickupContactPersonEmail, this.deliveryContactPerson, this.deliveryContactPersonMobile, this.deliveryContactPersonEmail,
        this.amount, 'fake ref', 'Pending', 'Awaiting Drivers Acceptance', this.user.email, this.vehicleType, 'Nobody') 
        
      // Present closest Driver

    this.loadingCtrl.create({keyboardClose: true, message: 'Getting a driver..', spinner: 'dots'})
    .then(loadingEl => {
      loadingEl.present();
      this.driver = this.requestService.findDriver(this.ref, this.serviceType, this.pickupLat, this.pickupLng, this.vehicleType)
      // this.requestService.simpleObservable
      // .subscribe(data => {
        // console.log('Driver Details..' + data);
        
        // loadingEl.dismiss();
        
        if (this.driver) { 
          loadingEl.dismiss();
          console.log('Driver: ' + this.driver.name + ',' + this.driver.vehicleType + ',' + this.driver.vehicleReg);
          console.log('Pick Addy: ' + this.pickupAddress);
          // this.router.navigateByUrl('/start-alaaru/operations-starts');
          // this.router.navigateByUrl('/start-alaaru/operations-initials');
          this.requestConfirmed = true;
          this.vehicleSelected = false;
          this.getCurrentLocation();
        } else {
          // this.presentToastCongnitoError(err.message);
        }
    })
    

    } else {
      // Submit Transaction 
      this.requestService.submitRequest('default',this.interstate, this.pickupCity, this.deliveryCity, false, this.pickupAddress,
      this.deliveryAddress, this.weight, this.worth, this.serviceType, new Date(), new Date(), this.pickupLat, this.pickupLng,
      this.deliveryLat, this.deliveryLng, this.itemDescription, this.pickupContactPerson, this.pickupContactPersonMobile,
      this.pickupContactPersonEmail, this.deliveryContactPerson, this.deliveryContactPersonMobile, this.deliveryContactPersonEmail,
      this.amount, 'fake ref', 'Pending', 'Awaiting Drivers Acceptance', this.user.email, this.vehicleType, 'Nobody')
    
      // this.router.navigateByUrl('payment');
      
      this.modalCtr.create({component: WebPaymentComponent, 
        componentProps: {refNumber: '020022', amount: this.amount}})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });

      // Present closest driver if instant
    }
    
  }
    
  // async presentToastCongnitoError(msg: string) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: 3000,
  //     color: 'danger',
  //     position: 'bottom',
  //     buttons: [
  //       {
  //         side: 'start',
  //         icon: 'alert'
  //       }
  //     ]
  //   });
  //   toast.present();
  // }

  onCancelRequest(){
    this.backHome = true;
    this.addressSet = false;
    this.vehicleSelected = false;
    this.requestConfirmed = false;    
    this.pictureEnlarged = false;
    this.getCurrentLocation();
  }
  onEnlargePicture() {
    this.pictureEnlarged = true;
    this.requestConfirmed = false;
  }

  onClosePicture() {
    this.pictureEnlarged = false;
    this.requestConfirmed = true;
  }

  // trackMovement() {
  //   let watch = this.geolocation.watchPosition();
  //   watch.subscribe((data) => {
  //   // data can be a set of coordinates, or an error (if an error occurred).
  //   // data.coords.latitude
  //   // data.coords.longitude
  // });
  // }

  onCallDriver() {
    this.callNumber.callNumber(this.driver.phone, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

  // Close app with a last back button
  ngAfterViewInit() {
    console.log('after init is here');
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
  });
}
// End close app

ngOnDestroy() {
  this.backButtonSubscription.unsubscribe();
}

// Test location tracking
startTracking() {
  this.isTracking = true;
  this.trackedRoute = [];

  this.positionSubscription = this.geolocation.watchPosition()
    .pipe(
      filter((p) => p.coords !== undefined) //Filter Out Errors
    )
    .subscribe(data => {
      setTimeout(() => {
        this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
        // Test code begins here
        if (this.marker !== null) {
          
          this.marker.setMap(null); // Remove the current marker

          let newLocation = new google.maps.LatLng({lat: data.coords.latitude, lng: data.coords.longitude});
          map: this.map;
          this.marker.draggable = true;
          this.marker.animation = google.maps.Animation.BOUNCE;
          this.marker.position = newLocation;
          
            // let contains = google.maps.MapCanvasProjection()
            
            
            this.marker = new google.maps.Marker({
              map: this.map,
              // animation: google.maps.Animation.BOUNCE,
              position: newLocation,
              icon: { path: google.maps.SymbolPath.CIRCLE,
                scale: 10
              }

          }); 

          
        }

        // test code ends here
        
        // this.redrawPath(this.trackedRoute);
      }, 0);
    });

}

onClearTracking() {
  this.trackedRoute = [];
}

redrawPath(path) {
  if (this.currentMapTrack) {
    this.currentMapTrack.setMap(null);
  }

  if (path.length > 1) {
    this.currentMapTrack = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#ff00ff',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.currentMapTrack.setMap(this.map);
  }
}

stopTracking() {
  let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
  this.previousTracks.push(newRoute);
  // this.storage.set('routes', this.previousTracks);
 
  this.isTracking = false;
  this.positionSubscription.unsubscribe();
  this.currentMapTrack.setMap(null);
}
 
showHistoryRoute(route) {
  this.redrawPath(route);
}
// End location tracking

// Add online drivers in my vicinity
addMarkers(markers: OnlineUsers[]){

  let marker;
  let markerLatLng;
  let lat;
  let lng;

  markers.forEach((marker) => {
    
    this.vehicle = this.requestService.getOneVehicle(marker.vehicleType);

    console.log(this.vehicle.imageUrl);

      lat = marker.lat;
      lng = marker.lng;
      console.log('lat,lng: ' + lat + ',' + lng);
      markerLatLng = new google.maps.LatLng(lat, lng);

      if(!this.markerExists(lat, lng)){

          this.marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: markerLatLng,
              icon: this.vehicle.smallImageUrl
          }); 

          let markerData = {
              lat: lat,
              lng: lng,
              marker: marker
          };

          this.markers.push(markerData);

      }

  });

}

markerExists(lat, lng){

  let exists = false;

  this.markers.forEach((marker) => {
      if(marker.lat === lat && marker.lng === lng){
          exists = true;
      }
  });

  return exists;

}
}
