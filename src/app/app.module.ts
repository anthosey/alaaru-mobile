import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Angular4PaystackModule } from 'angular4-paystack';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { MenuComponent } from './menu/menu.component';

import { AmplifyAngularModule, AmplifyService, AmplifyModules, AmplifyIonicModule } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import Interactions from '@aws-amplify/interactions';
import Storage from '@aws-amplify/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  entryComponents: [],
    imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule,
    Angular4PaystackModule.forRoot('pk_test_deeb7ec8ef28f883d41be72ce9be491eaeb348a7'),
  AmplifyAngularModule],
  
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    NativeGeocoder,
    Geolocation,
    CallNumber,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
