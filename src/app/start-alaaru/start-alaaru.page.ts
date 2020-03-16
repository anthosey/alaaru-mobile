import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { RequestService } from '../services/request.service';
const { Geolocation, Geocoder, ReverseGeocoder } = Plugins;

import { dayStyle } from './map-styles';
import { nightStyle } from './night-map-styles';
import { AuthService } from '../services/auth.service';
import { AuthUSer } from '../auth/model/auth-user.model';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-start-alaaru',
  templateUrl: './start-alaaru.page.html',
  styleUrls: ['./start-alaaru.page.scss'],
})
export class StartAlaaruPage implements OnInit, AfterViewInit {
  map: any;
  lat: number;
  lng: number;

  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocomplete_delivery: { input: string; };
  autocompleteItems: any[];
  autocompleteItems_delivery: any[];
  mStyle = [];
  user: AuthUSer;
  serviceType = "Instant pickup"

  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;
  tMode = google.maps.TravelMode.DRIVING;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  constructor(private requestService: RequestService,
    public zone: NgZone,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private router: Router) { }

  ngOnInit() {
    // this.user = this.authService.getLoggedInUser();
    console.log('U2' + this.authService.getLoggedInUser());
    // console.log('U' + this.user.firstName);
    return;
  }


  isNight() {
    //Returns true if the time is between
    //7pm to 5am
    let time = new Date().getHours();
    // time = 22;
    return (time > 5 && time < 19) ? false : true;
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    console.log('Location' + coordinates.coords.latitude + ',' + coordinates.coords.longitude);
    // let pos = {
    //   lat: coordinates.coords.latitude,
    //   lng: coordinates.coords.longitude
    // };

    if (this.isNight()) {
      this.mStyle = nightStyle
    } else { this.mStyle = dayStyle }


    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.lat, lng: this.lng },
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: this.mStyle,
      // zoomControl: true,
      // zoomControlOptions: {
      // position: google.maps.ControlPosition.RIGHT_CENTER
      // }

    });

    // return pos;
  }

  initMap() {
    var pointA = new google.maps.LatLng(this.originLat, this.originLng),
      pointB = new google.maps.LatLng(this.destLat, this.destLng),
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
        title: "point A",
        label: "A",
        map: map
      }),
      markerB = new google.maps.Marker({
        position: pointB,
        title: "point B",
        label: "B",
        map: map
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


  ionViewDidEnter() {
    
    console.log('ionview Did enter');
    // this.initMap();
    // Get current user location
    // this.user = this.authService.getLoggedInUser();
    // console.log(this.user);



    // this.directionsService.route({
    //   origin: originLat + ',' + OriginLng,
    //   // origin: 9.060252 + ',' +7.4566583,
    //   destination: destLat+ ',' + destLng,
    //   // destination: 9.0712634 + ',' + 7.467269600000001,
    //   travelMode: this.tMode
    // }, (response, status) => {
    //   if (status === 'OK') {
    //     console.log('direction: ' + response.routes);
    //     this.directionsDisplay.setDirections(response);
    //     this.directionsDisplay.setMap(this.map);
    //   } else {
    //     window.alert('Directions request failed due to ' + status);
    //   }
    // });

  }

  ionViewWillEnter() {
    // this.getCurrentLocation();
    console.log('ion will enter');
    // this.originLat = this.requestService.pickupPosition.lat;
    // this.originLng = this.requestService.pickupPosition.lng;

    // this.destLat = this.requestService.deliveryPosition.lat;
    // this.destLng = this.requestService.deliveryPosition.lng;

    console.log('Origin:' + this.originLat + ',' + this.originLng);
    console.log('Destn:' + this.destLat + ',' + this.destLng);
    console.log('1st is me');

    

  }

  ngAfterViewInit() {
    console.log('after view Init');
    this.originLat = 9.0828756;
    this.originLng = 7.498680599999999;

    this.destLat = 9.0602998;
    this.destLng = 7.4565331;

    this.initMap();

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

          // this.modalCtrl.create({
          //   component:CityComponent,
          //   componentProps:{cities: this.cities },
          //   id: 'cityModal'}).then(modalEl =>{
          //   modalEl.present();
          //   return modalEl.onDidDismiss();
          // })
          // .then(resultData => {
          //   console.log(resultData.data.cityOption + ', ' + resultData.data.saveCitySelection);

          //   if (resultData.role === 'confirm'){
          //     if (!resultData.data.cityOption) {
          //       // show a toast
          //       this.presentToast();
          //     return;
          //     }
          //     this.logisticsType = 'Within city';
          //     this.requestService.setLogisticsType ('Within city');
          //     this.router.navigateByUrl('/vehicle-types')

          //   }
          // })

          console.log('Instant selected');
          this.serviceType = 'Instant pickup'
        }
      }, {
        text: 'Regular : (Pickup within 24 hours)',
        icon: 'hourglass',
        handler: () => {

          console.log('Standard selected');
          this.serviceType = '24hrs pickup'
          // this.router.navigateByUrl('/new-request/inter-city')
        }
      },

      {
        text: 'Schedule a',
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

  proceed() {
    this.router.navigateByUrl('start-alaaru/addresses');
  }
}
