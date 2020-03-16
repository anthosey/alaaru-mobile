import { Component, OnInit, NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Geolocation, Geocoder, ReverseGeocoder } = Plugins;
import { nightStyle } from '../night-map-styles';
import { dayStyle } from '../map-styles';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-operations-initial',
  templateUrl: './operations-initial.page.html',
  styleUrls: ['./operations-initial.page.scss'],
})
export class OperationsInitialPage implements OnInit {
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  accuracy: number;
  mStyle = [];
  map: any;

  constructor(private requestService: RequestService,
    public zone: NgZone,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController) { }


  ngOnInit() {
  }

  isNight(){
    //Returns true if the time is between
    //7pm to 5am
    let time = new Date().getHours();
    // time = 22;
    return (time > 5 && time < 19) ? false : true;
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    
    this.pickupLat = coordinates.coords.latitude;
    this.pickupLng = coordinates.coords.longitude;
    console.log('Location ' + coordinates.coords.latitude + ',' + coordinates.coords.longitude);
    // console.log('accuracy: ' + coordinates.coords.accuracy);
    this.accuracy = coordinates.coords.accuracy;
    // let pos = {
    //   lat: coordinates.coords.latitude,
    //   lng: coordinates.coords.longitude
    // };
  
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

    // return pos;
  }
  
  // ionViewDidEnter() {
  //   this.getCurrentLocation();
    
  // }

  ngAfterViewInit() {
    console.log('after init is here');
    this.getCurrentLocation();
  }

}
