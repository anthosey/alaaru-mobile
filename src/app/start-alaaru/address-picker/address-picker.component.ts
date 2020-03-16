import { Component, OnInit, Input, NgZone } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Geolocation, Geocoder, ReverseGeocoder } = Plugins;

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss'],
})
export class AddressPickerComponent implements OnInit {
@Input() lat: number;
@Input() lng: number;
deliveryAddress: string;
pickupAddress: string;
GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocomplete_delivery: { input: string; };
  autocompleteItems: any[];
  autocompleteItems_delivery: any[];

  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;

  pickupCity: string;
  deliveryCity: string;
  selectedCountry;
  placeid: any;
  geocoder: any;

  boundaryLat = 9.0764785;
  boundaryLng = 7.398574000000053;
constructor(private requestService: RequestService,
  public zone: NgZone,
  private router: Router,
  private modalCtrl: ModalController) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocomplete = { input: '' };
    this.autocomplete_delivery = { input: '' };
    this.autocompleteItems = [];
    this.autocompleteItems_delivery = [];
    this.geocoder = new google.maps.Geocoder;
    // this.markers = [];

   }

  ngOnInit() {}
  async setCurrentAddress() {
    // console.log('Pickup Location 1:' + this.lat + ',' + this.lng);
    this.pickupLat = this.lat;
    this.pickupLng = this.lng;
    let geocoder = await new google.maps.Geocoder();
    let latlng = await new google.maps.LatLng(this.lat, this.lng);

    let request = { location: latlng };

    await geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        let result = results[0];
        this.zone.run(() => {
          if (result != null) {
            console.log('Pickup Addy 1: ' + result.formatted_address); 
            // this.pickupAddress = result.formatted_address;
            this.autocomplete.input = result.formatted_address;
            this.pickupAddress = result.formatted_address;
          }
          });

          // Check city
          for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    this.pickupCity= results[0].address_components[i].long_name;
                    this.requestService.pickupCity=this.pickupCity;
                    console.log('pickupCity 1: ' + this.pickupCity);
                    break;
                }
            }
          }
          // End check city

      }
    })
  }

  // Autocomplete for pickup address starts here
  async updateSearchResults() {

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];

      return;
    }
    // console.log('Lat: ' + this.requestService.boundaryLat + ', ' + 'Lng: ' + this.requestService.boundaryLng);
    let limitLocationLatLng = await new google.maps.LatLng(this.boundaryLat, this.boundaryLng); // This is default location: Abuja
    
    // console.log('now lat 2:' + limitLocationLatLng)
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
    this.pickupAddress = item.description;

    // this.location = item
    this.placeid = item.place_id
    console.log('placeid' + this.placeid)


    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.pickupLat = results[0].geometry.location.lat();
        this.pickupLng = results[0].geometry.location.lng();
        
        console.log('Pickup Location 2:' + this.pickupLat + ',' + this.pickupLng);
        this.requestService.setPickupPosition(this.pickupLat, this.pickupLng);
         // Check city
         for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  this.pickupCity= results[0].address_components[i].long_name;
                  this.requestService.pickupCity=this.pickupCity;
                  console.log('pickupCity 2: ' + this.pickupCity);
                  break;
              }
          }
        }
        // End check city
        // if (this.autocomplete_delivery) {
        //   this.modalCtrl.dismiss({pickLat: this.pickupLat, pickLng: this.pickupLng, delLat: this.deliveryLat, delLng: this.deliveryLng, pickupCity: this.pickupCity, deliveryCity: this.deliveryCity, pickupAddress: this.pickupAddress, deliveryAddress: this.deliveryAddress}, 'confirm');
        // }
        
      }
    });
   
    
  }
  // autocomplete for pickup address ends here


  // Auto complete for Delivery Address starts here
  async updateSearchResults_delivery() {
    if (this.autocomplete_delivery.input == '') {
      this.autocompleteItems_delivery = [];
      return;
    }

    let limitLocationLatLng = await new google.maps.LatLng(this.boundaryLat, this.boundaryLng); // This is default location: Abuja
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
    this.deliveryAddress = item.description;

    // this.location = item
    this.placeid = item.place_id
    console.log('placeid' + this.placeid)


    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.deliveryLat = results[0].geometry.location.lat();
        this.deliveryLng = results[0].geometry.location.lng();

        console.log('Delivery Location' + this.deliveryLat + ',' + this.deliveryLng);
        this.requestService.setDeliveryPosition(this.deliveryLat, this.deliveryLng);

         // Check city
         for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  this.deliveryCity= results[0].address_components[i].long_name;
                  this.requestService.deliveryCity=this.deliveryCity;
                  console.log('deliveryCity: ' + this.deliveryCity);
                  break;
              }
          }
        }
        // End check city
        this.modalCtrl.dismiss({pickLat: this.pickupLat, pickLng: this.pickupLng, delLat: this.deliveryLat, delLng: this.deliveryLng, pickupCity: this.pickupCity, deliveryCity: this.deliveryCity, pickupAddress: this.pickupAddress, deliveryAddress: this.deliveryAddress}, 'confirm');
      }
    })
      
  }

  // autocomplete for delivery address stops here

  ionViewDidEnter() {
    console.log('did enter ooo');
    this.selectedCountry = this.requestService.selectedCountry;
    this.setCurrentAddress();
  }
  
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
