import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RequestService } from 'src/app/services/request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-web-payment',
  templateUrl: './web-payment.component.html',
  styleUrls: ['./web-payment.component.scss'],
})
export class WebPaymentComponent implements OnInit {
@Input() refNumber: string;
@Input() amount: number;
x: Subscription;
  constructor(private modalCtrl: ModalController,
              private requestService: RequestService) { }

  ngOnInit() {}
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  openBrowser() {
    // await Browser.open({ url: 'https://alaaru.herokuapp.com/' });
    this.x = this.requestService.callPaystack()
    .subscribe(data => {
      console.log(data.status);
      console.log(data.data[0]);
    });
  }
}
