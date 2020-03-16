import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthUSer } from 'src/app/auth/model/auth-user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-person',
  templateUrl: './contact-person.component.html',
  styleUrls: ['./contact-person.component.scss'],
})
export class ContactPersonComponent implements OnInit {
  deliveryContactPersonEmail: string;
  deliveryContactPersonMobile: string;
  deliveryContactPerson: string;

  pickupContactPersonEmail: string;
  pickupContactPersonMobile: string;
  pickupContactPerson: string;

  @Input() pickupFromMe: boolean;
  @Input() deliverToMe: boolean;
  user: AuthUSer;
  constructor(private modalCtrl: ModalController,
              private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    if(this.pickupFromMe) {
      this.pickupUseMyContact();
    }
    if (this.deliverToMe){
      this.deliveryUseMyContact();
    }
  }

  pickupUseMyContact() {
    this.pickupContactPerson = this.user.firstName;
    this.pickupContactPersonEmail = this.user.email;
    this.pickupContactPersonMobile = this.user.mobile;
  }

  deliveryUseMyContact() {
    this.deliveryContactPerson = this.user.firstName;
    this.deliveryContactPersonEmail = this.user.email;
    this.deliveryContactPersonMobile = this.user.mobile;
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  acceptOptions(){
    this.modalCtrl.dismiss({
      pickupContactPerson: this.pickupContactPerson, 
      pickupContactPersonMobile: this.pickupContactPersonMobile,
      pickupContactPersonEmail: this.pickupContactPersonEmail,
      pickupFromMe: this.pickupFromMe,

      deliveryContactPerson: this.deliveryContactPerson, 
      deliveryContactPersonMobile: this.deliveryContactPersonMobile,
      deliveryContactPersonEmail: this.deliveryContactPersonEmail,
      deliverToMe: this.deliverToMe}, 'confirm');
    
    }
    
    changeDeliverToMe() {
      this.deliverToMe = !this.deliverToMe;
      console.log('d:' + this.deliverToMe);
      if (this.deliverToMe) {
        this.deliveryUseMyContact();
      }
    }

    changePickupFromMe() {
      this.pickupFromMe = !this.pickupFromMe;
      console.log('p:' + this.pickupFromMe);
      if (this.pickupFromMe) {
        this.pickupUseMyContact();
      }
    }
  }
