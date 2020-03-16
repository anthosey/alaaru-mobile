import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { RequestService } from 'src/app/services/request.service';
import { Country } from '../model/country';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-amplify-login',
  templateUrl: './amplify-login.page.html',
  styleUrls: ['./amplify-login.page.scss'],
})
export class AmplifyLoginPage implements OnInit {
  countries: Country[];
  country= "Nigeria";
  countryCode = "ng";
  flagUrl ="assets/img/nigeria.svg";
  
  constructor(private authService: AuthService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private requestService: RequestService,) { }

  ngOnInit() {
    
  }
// usernameAttributes = "email"; 
  signUpConfig = {
    header: 'My Customized Sign Up',
    hideAllDefaults: true,
    defaultCountryCode: '234',
    signUpFields: [
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 4,
        type: 'password'
      },
      {
        label: 'Phone Number',
        key: 'phone_number',
        required: true,
        displayOrder: 3,
        type: 'string'
      },
      {
        label: 'First Name',
        key: 'firstName',
        required: false,
        displayOrder: 1,
        type: 'string',
        custom: true
      },
      {
        label: 'Username',
        key: 'Username',
        required: false,
        displayOrder: 5,
        type: 'string',
        custom: true
      }
    ]
  }

  
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      
      header: 'Select your Country',
      cssClass: 'actionSheet',
      buttons: [{
        text: 'Nigeria',
        role: 'destructive',
        icon: 'assets/img/nigeria.svg',
        handler: () => {
          this.country = "Nigeria",
          this.countryCode = 'ng';
          this.flagUrl='assets/img/nigeria.svg'
          this.requestService.setCountry(this.countryCode);
          console.log('Nigeria Selected');
        }
      }, {
        text: 'Ghana',
        icon: 'assets/img/ghana.svg',
        handler: () => {
  
          this.country = "Ghana",
          this.countryCode = 'gh';
          this.flagUrl='assets/img/ghana.svg'
          this.requestService.setCountry(this.countryCode);
          console.log('Ghana selected');
          
        }
      }, {
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
}
