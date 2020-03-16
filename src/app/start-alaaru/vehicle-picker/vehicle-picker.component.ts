import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonRadioGroup, IonButton } from '@ionic/angular';
import { RequestService } from 'src/app/services/request.service';
import { VehicleTypes } from 'src/app/vehicle-types/vehicle.model';
import { OnlineUsers } from 'src/app/model/online-user';

@Component({
  selector: 'app-vehicle-picker',
  templateUrl: './vehicle-picker.component.html',
  styleUrls: ['./vehicle-picker.component.scss'],
})
export class VehiclePickerComponent implements OnInit {
@Input() weight: number;
@Input() serviceType: string;
@Input() pickupLat: number;
@Input() pickupLng: number;
amount = 2000;
vehicleType: string;
vehicleTypes: VehicleTypes[];
vehicleTypesAllOptions: VehicleTypes[];
changeToRegular = false;
showOtherOptions = false;
ETA = 3;
vehicleSelected = false;
closestDriver: OnlineUsers;
  constructor(private modalCtrl: ModalController,
              private requestService: RequestService) { }

  ngOnInit() {
    console.log('type:' + this.serviceType);
    this.vehicleTypes = [];
    if (this.serviceType === 'Instant pickup') {
      // Search for availale vehicle in the locality
      this.vehicleTypes = this.requestService.getVehicleTypesOnline(this.pickupLat, this.pickupLng);
      // Check if there's no vehicle online within the customer's vicinity
      if (this.vehicleTypes.length < 1) {
        console.log('No vehicle 0000');
        this.changeToRegular = true;
        this.vehicleTypes = this.requestService.getAllVehicles();  
      }
    } else {
      this.vehicleTypes = this.requestService.getAllVehicles();
    }
    
    this.vehicleTypesAllOptions = this.requestService.getAllVehicles(); // No vehicle is online at all
    if (this.vehicleTypes.length > 0) { // Remove vehicle types that are available from the list of others options.
      for( var i = 0; i < this.vehicleTypesAllOptions.length; i++){ 
        for (var j = 0; j < this.vehicleTypes.length; j++) {
          if ( this.vehicleTypesAllOptions[i].vehicleType === this.vehicleTypes[j].vehicleType) { this.vehicleTypesAllOptions.splice(i, 1); }
        }
        
      }
    } 
  }

// selectVehicle() {
//   this.modalCtrl.dismiss({vehicleType: this.vehicleType, amount: this.amount}, 'confirm');
// }

onCancel() {
  this.modalCtrl.dismiss(null, 'cancel');
}

onChange(i: number) {
  // this.vehicleType = vehicle;
  // console.log('Choice: ' + vehicle.value);
  this.closestDriver = this.requestService.getClosestDriver(this.pickupLat, this.pickupLng, this.vehicleTypes[i].vehicleType)
console.log('Selected ' + this.vehicleTypes[i].vehicleType);
this.modalCtrl.dismiss({
  vehicleType: this.vehicleTypes[i].vehicleType, 
  amount: this.amount,
  ETA: this.closestDriver.eta,
  vehicleSelected: true,
  vehicleImage: this.vehicleTypes[i].imageUrl}, 'confirm');

  // if (this.vehicleOption === 'Bike') {
  //   this.fullVehicleCapacity = false;
  //   this.requestService.setVehicleCapacity(false);
  // }
}

onChangeOthers(i: number) {
  // this.vehicleType = vehicle;
  // console.log('Choice: ' + vehicle.value);
  this.changeToRegular = true;
console.log('Selected ' + this.vehicleTypesAllOptions [i].vehicleType);
this.modalCtrl.dismiss({
                        vehicleType: this.vehicleTypesAllOptions[i].vehicleType, 
                        amount: this.amount, 
                        changeToRegular: this.changeToRegular,
                        ETA: this.vehicleTypesAllOptions[i].baseEta,
                        vehicleSelected: true,
                        vehicleImage: this.vehicleTypesAllOptions[i].imageUrl}, 'confirm');

  // if (this.vehicleOption === 'Bike') {
  //   this.fullVehicleCapacity = false;
  //   this.requestService.setVehicleCapacity(false);
  // }
}
changeMoreOptions() {
  this.showOtherOptions = !this.showOtherOptions;
  console.log(this.showOtherOptions);
}
}
