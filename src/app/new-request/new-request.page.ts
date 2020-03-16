import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSelect, IonToggle, AlertController, PopoverController } from '@ionic/angular';
import { MiniRequest } from './miniRequest.model';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Geolocation, Geocoder, ReverseGeocoder } = Plugins;
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { stringify } from 'querystring';
import { ServiceTypes } from './model/service.model';
import { PopoverComponent } from './popover/popover.component';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})

export class NewRequestPage implements OnInit {
  miniRequest: MiniRequest;
  quote;
  serviceOp: string;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  serviceOption: string;
  serviceTypes: ServiceTypes[];
  deliveryLocationSwitch: any;
  boundaryLat: number;
  boundaryLng: number;
  boundaryCity: string;
  selectedCountry: string;
  pickupSwitchState = false;
  deliverySwitchState = false;
  plat: string[] = [];
  vehicleOption: string;
  loading = false;
  loading2 = false;
  fullVehicleCapacity: boolean;
  accompanyOption: string;
  
  logisticsType: string;
  interstate_ServiceOption: string;
  interstate_CityFrom: string;
  interstate_CityTo: string;



  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocomplete_delivery: { input: string; };
  autocompleteItems: any[];
  autocompleteItems_delivery: any[];
  location: any;
  placeid: any;
  map: any;
  geocoder: any;
  markers: any;


  //   options = {
  //     types: ['(cities)'],
  //     componentRestrictions: {country: 'fr'}
  // };

  constructor(private requestService: RequestService,
    private router: Router,
    public zone: NgZone,
    // private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    public alertController: AlertController,
    private popoverController: PopoverController) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocomplete = { input: '' };
    this.autocomplete_delivery = { input: '' };
    this.autocompleteItems = [];
    this.autocompleteItems_delivery = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }


  async updateSearchResults() {

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];

      return;
    }
    console.log('Lat: ' + this.requestService.boundaryLat + ', ' + 'Lng: ' + this.requestService.boundaryLng);
    let limitLocationLatLng = await new google.maps.LatLng(this.requestService.boundaryLat, this.requestService.boundaryLng); // This is default location: Abuja
    // if (this.boundaryCity) {  // There is city selection from the city component, so use what is select otherwise default to Abuja as stated above

    //   console.log('Now City: ' + this.boundaryCity);
    //   let geocoder = await new google.maps.Geocoder();
    //   await geocoder.geocode({ address: this.boundaryCity }, (results, status) => {
    //     if (status == 'OK') {
    //       limitLocationLatLng = results[0].geometry.location;
    //       console.log('Now Lat: ' + limitLocationLatLng.lat());
    //       console.log('country Now: ' + this.selectedCountry);
    //     }
    //   })

    // }
    // console.log(limitLocationLatLng.lat());
    console.log('now lat 2:' + limitLocationLatLng)
    this.GoogleAutocomplete.getPlacePredictions({
      input: this.autocomplete.input,
      componentRestrictions: { country: this.selectedCountry }, // The Component restrictions are used to restrict predictions to only those within the parent component. For example, the country. 
      location: limitLocationLatLng, //Type: LatLng. Location for prediction biasing. Predictions will be biased towards the given location and radius. Alternatively, bounds can be used
      radius: 100000
    }, // Radius is the radius covered from the location limit set, it is optional
      // see link for details https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item) {
    console.log(item)
    // my codes
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];

    this.location = item
    this.placeid = this.location.place_id
    console.log('placeid' + this.placeid)


    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        this.pickupLat = lat;
        this.pickupLng = lng;
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        console.log('Location :' + lat + ',' + lng);
      }
    })


  }


  async updateSearchResults_delivery() {
    if (this.autocomplete_delivery.input == '') {
      this.autocompleteItems_delivery = [];
      return;
    }

    let limitLocationLatLng = await new google.maps.LatLng(this.boundaryLat, this.boundaryLng);
    this.GoogleAutocomplete.getPlacePredictions({
      input: this.autocomplete_delivery.input,
      componentRestrictions: { country: this.selectedCountry }, // The Component restrictions are used to restrict predictions to only those within the parent component. For example, the country. 
      location: limitLocationLatLng, //Type: LatLng. Location for prediction biasing. Predictions will be biased towards the given location and radius. Alternatively, bounds can be used
      radius: 100000
    },
      (predictions, status) => {
        this.autocompleteItems_delivery = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems_delivery.push(prediction);
          });
        });
      });
  }

  selectSearchResult_delivery(item) {

    console.log(item)
    // my codes
    this.autocomplete_delivery.input = item.description;
    this.autocompleteItems_delivery = [];

    this.location = item
    this.placeid = this.location.place_id
    console.log('placeid' + this.placeid)


    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();

        this.deliveryLat = lat;
        this.deliveryLng = lng;

        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          title: item.description,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        console.log('Location' + lat + ',' + lng);
        // let line = new google.maps.DirectionsService;
      }
    })

  }
  // GoTo(){
  //   return window.location.href = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid;
  // }

  async getCurrentPosition(dls: IonToggle) {
    if (dls.checked) {
      if (dls.name === 'pickupSwitch') {
        this.loading = true;
      } else { this.loading2 = true; }

      const coordinates = await Geolocation.getCurrentPosition();
      let lat = coordinates.coords.latitude;
      let lng = coordinates.coords.longitude;
      console.log('Location' + coordinates.coords.latitude + ',' + coordinates.coords.longitude);
      let pos = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      this.map.setCenter(pos);

      // } else { // USE the web to find a reverseGeocode
      let geocoder = await new google.maps.Geocoder();
      let latlng = await new google.maps.LatLng(lat, lng);
      let request = { location: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          this.zone.run(() => {
            if (result != null) {
              console.log('nearest Addy: ' + result.formatted_address);
              console.log('wstich: ' + dls.name);
              if (dls.name === 'pickupSwitch') {
                this.pickupSwitchState = true;
                this.autocomplete.input = result.formatted_address;
                this.autocompleteItems = [];
                this.loading = false;
                this.pickupLat = lat;
                this.pickupLng = lng;
                if (this.deliverySwitchState === true) {
                  this.autocomplete_delivery.input = '';
                  this.deliverySwitchState = false;
                }
              } else {
                this.deliverySwitchState = true;
                this.autocomplete_delivery.input = result.formatted_address;
                this.autocompleteItems_delivery = [];
                this.loading2 = false;
                this.deliveryLat = lat;
                this.deliveryLng = lng;

                if (this.pickupSwitchState === true) {
                  this.autocomplete.input = '';
                  this.pickupSwitchState = false;
                }
              }

            }
          })
        }
      });
      // }
    } else { //DO not use current position
      if (dls.name === 'pickupSwitch') {
        this.autocomplete.input = '';
      } else {
        this.autocomplete_delivery.input = '';
      }
    }
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      console.log('Altitude: ' + position.coords.altitude);
    })
  }



  ngOnInit() {
    this.vehicleOption = this.requestService.getVehicleOption();
    if (!this.vehicleOption && this.logisticsType === 'Within city') {
      this.router.navigate(['/vehicle-types']);
    }
    this.serviceTypes = this.requestService.getAllServices();
    // console.log(this.serviceTypes[0].serviceType);
  }

  onSubmit(f: NgForm) {
    // console.log(f);
    this.serviceOp = this.serviceOption;
    console.log('Service Op:' + f.value.serviceOption);
    this.quote = this.requestService.getQuote(
      f.value.weight,
      f.value.worth,
      f.value.pickupAddress,
      f.value.deliveryAddress,
      this.serviceOp,
      f.value.pickupTime,
      f.value.deliveryTime,
      this.pickupLat,
      this.pickupLng,
      this.deliveryLat,
      this.deliveryLng);
    console.log('My Quote:' + this.quote);
    this.router.navigate(['/new-request/description']);
  }
  onChangeServiceOption(o: IonSelect) {
    // console.log(o);
    this.serviceOption = o.value;
    console.log(this.serviceOption);
  }


  onChangeAccompanyOption(aO: IonSelect) {
    this.accompanyOption = aO.value;
    this.requestService.setAccompanyOption = aO.value;
  }

  ionViewWillEnter() {
    // Check for inter-state service options
    this.logisticsType = this.requestService.logisticsType;
    this.interstate_ServiceOption = this.requestService.interstateServiceOption;
    this.interstate_CityFrom = this.requestService.interstateCityFrom;
    this.interstate_CityTo = this.requestService.interstateCityTo;

  }
  ionViewDidEnter() {
    //  this.plat = this.platform.platforms();
    //  console.log('Platform: ' + this.plat);

    
    console.log('PRE: ' + this.logisticsType, this.interstate_ServiceOption, this.interstate_CityFrom, this.interstate_CityTo);

    this.selectedCountry = this.requestService.selectedCountry;
    this.requestService.cityOption();
    this.quote = this.requestService.fetchEstimate();
    this.fullVehicleCapacity = this.requestService.fullVehicleCapacity;
    // get selected vehicle option
    this.vehicleOption = this.requestService.getVehicleOption();
    // console.log(this.serviceOption[1]);
    //Set latitude and longitude of some place
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.requestService.boundaryLat, lng: this.requestService.boundaryLng },
      zoom: 15
    });
  }

  async presentAlert() {
    let x = JSON.stringify(this.platform.platforms());

    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: x,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {stateSelected: 'Lagos, Nigeria'}
    });
    return await popover.present();
  }
}
