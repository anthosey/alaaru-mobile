import { Component, OnInit, NgZone } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Geolocation, Geocoder, ReverseGeocoder } = Plugins;


@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocomplete_delivery: { input: string; };
  autocompleteItems: any[];
  autocompleteItems_delivery: any[];

  boundaryLat = 9.0764785;
  boundaryLng = 7.398574000000053;
  selectedCountry;
  location: any;
  placeid: any;
  map: any;
  geocoder: any;
  markers: any;

  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  pickupAddress: string;
  pickupCity: string;
  deliveryCity: string;
  constructor(private requestService: RequestService,
              public zone: NgZone,
              private router: Router) {
                this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

                this.autocomplete = { input: '' };
                this.autocomplete_delivery = { input: '' };
                this.autocompleteItems = [];
                this.autocompleteItems_delivery = [];
                this.geocoder = new google.maps.Geocoder;
                this.markers = [];
            
               }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async setCurrentAddress() {
    console.log('Pickup Location 1:' + this.pickupLat + ',' + this.pickupLng);
    let geocoder = await new google.maps.Geocoder();
    let latlng = await new google.maps.LatLng(this.pickupLat, this.pickupLng);

    let request = { location: latlng };

    await geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        let result = results[0];
        this.zone.run(() => {
          if (result != null) {
            console.log('Pickup Addy 1: ' + result.formatted_address); 
            this.pickupAddress = result.formatted_address;
            this.autocomplete.input = result.formatted_address;
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
  
ionViewDidEnter() {
  this.selectedCountry = this.requestService.selectedCountry;
  // this.pickupLat = this.requestService.pickupPosition.lat;
  // this.pickupLng = this.requestService.pickupPosition.lng;
  // this.getCurrentLocation();
  //set current address
  this.setCurrentAddress();
  
}

  async updateSearchResults() {

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];

      return;
    }
    // console.log('Lat: ' + this.requestService.boundaryLat + ', ' + 'Lng: ' + this.requestService.boundaryLng);
    let limitLocationLatLng = await new google.maps.LatLng(this.boundaryLat, this.boundaryLng); // This is default location: Abuja
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
        this.pickupLat = results[0].geometry.location.lat();
        this.pickupLng = results[0].geometry.location.lng();
        
        // let marker = new google.maps.Marker({
        //   position: results[0].geometry.location,
        //   map: this.map,
        // });
        // this.markers.push(marker);
        // this.map.setCenter(results[0].geometry.location);
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
      }
    });
    
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.pickupLat = coordinates.coords.latitude;
    this.pickupLng = coordinates.coords.longitude;
    console.log('Location ' + coordinates.coords.latitude + ',' + coordinates.coords.longitude);
    // let pos = {
    //   lat: coordinates.coords.latitude,
    //   lng: coordinates.coords.longitude
    // };
  
      // if(this.isNight()){
      //   this.mStyle = nightStyle 
      // } else { this.mStyle = dayStyle}

    
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat:  this.pickupLat, lng: this.pickupLng },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      // styles: this.mStyle,
      // zoomControl: true,
      // zoomControlOptions: {
      // position: google.maps.ControlPosition.RIGHT_CENTER
      // }

    });

    // return pos;
  }

  initMap() {
    var pointA = new google.maps.LatLng(this.pickupLat, this.pickupLng),
      pointB = new google.maps.LatLng(this.deliveryLat, this.deliveryLng),
      // centerPoint = new google.maps.LatLng(9.0602711,7.4566257),
      myOptions = {
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        // styles: this.mStyle,
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
        this.deliveryLat = results[0].geometry.location.lat();
        this.deliveryLng = results[0].geometry.location.lng();

        // let marker = new google.maps.Marker({
        //   position: results[0].geometry.location,
        //   map: this.map,
        //   title: item.description,
        // });
        // this.markers.push(marker);
        // this.map.setCenter(results[0].geometry.location);
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
        // this.router.navigateByUrl('/start-alaaru');
        this.initMap();
      }
    })
      
  }

  watchPickupAddress() {
    if (!this.autocomplete.input) {
      this.autocomplete.input = this.pickupAddress;
    }
  }
  
}
