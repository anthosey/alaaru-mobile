import { Component, OnInit, Input } from '@angular/core';
import { City } from '../city.model';
import { ModalController, IonSelect, IonCheckbox, IonToggle } from '@ionic/angular';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
@Input() cities: City;
cityOption: string;
saveCityOption;
  constructor(private modalCtrl: ModalController,
              private requestService: RequestService,
              private router: Router) { }

  ngOnInit() {}

  IonViewDidEnter() {
    // this.saveCityOption = false;
    console.log('opton:' + this.saveCityOption);
  }
  onChangeCityOption(cityCtr: IonSelect) {
    this.cityOption = cityCtr.value;
    this.requestService.setCityOption(this.cityOption);
    console.log('CityOption: ' + this.cityOption);
  }

  onChangeSaveOption(saveCtrl: IonToggle) {
    this.saveCityOption = saveCtrl.value;
    console.log('SaveOptionClick: ' + this.saveCityOption);
  }

  onCancel() {
    this.modalCtrl.dismiss('cityModal', 'cancel');
  }

  onProceed() {
    this.modalCtrl.dismiss({cityOption: this.cityOption, saveCitySelection: this.saveCityOption}, 'confirm' );
  }
}
