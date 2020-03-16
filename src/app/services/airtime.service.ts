import { Injectable } from '@angular/core';
import { Transaction } from '../fund-wallet/transaction.model';
import { FullRequest } from '../new-request/full-request.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})

export class AirtimeService {
  mtn: string[] = ['0703','0706','0803','0806','0810','0813','0814','0816','0903','0906'];
  airtel: string[] = ['0701','0708','0802','0808','0812','0902','0907','0901','0904'];
  glo: string[] = ['0705','0805','0807','0811','0815','0905'];
  etisalat: string[] = ['0809', '0817','0818', '0908','0909'];

  networkCode: string;
  private _networkProvider: string;
  private _mobile: string;
  private _amount: number;
  transactionDesc: string;

  ref2: string;

  transaction: Transaction;

  constructor(private requestService: RequestService) { }

  get networdProvider() {
    return this._networkProvider;
  }

  set mobile(mob: string) {
    this._mobile = mob;
  }

  get mobile() {
    return this._mobile;
  }

  get amount() {
    return this._amount;
  }

  set amount(am: number) {
    this._amount = am;
  }


  verifyNetwork(code: string) {
     if (this.mtn.find(fr=> fr === code)) {
      this._networkProvider = 'mtn';
       return this._networkProvider;
     } else if (this.glo.find(fr=> fr === code)) {
      this._networkProvider ='glo';
       return this._networkProvider;
     } else if (this.airtel.find(fr=> fr === code)){
      this._networkProvider = 'airtel';
       return this._networkProvider;
     } else if (this.etisalat.find(fr=> fr === code)) {
      this._networkProvider = '9mobile';
      return this._networkProvider;
     };
  }


  getRefNumber() {
    // initiate transaction on the server and get a ref number
    if (!this.ref2)  {const ref = Math.floor((Math.random() * 30) + 1);
      this.ref2 = 'AR_002' + ref;
  }
    this.transactionDesc= 'Airtime purchase mobile :' + this._mobile + ', Amount: ' + this._amount + ', Provider: ' + this._networkProvider;
    this.transaction = new Transaction(this.ref2, 'Airtime Recharge', this._amount, 'Completed', this.transactionDesc, 'Paid');
    return this.transaction;
  }
  
  submitPayment() {
    // submit transaction to the server, then call payment gateway
 
  const fullRequest = new FullRequest(this.transaction.transactionTitle, '', '', '',false, '', '', 0, 0, '', new Date(), new Date(), 0, 0, 0, 0, this.transaction.transactionDescription, '', '', '', 'user.name', 'user.mobile','user.email', this.transaction.transactionAmount, this.transaction.transactionRef, 'Paid', this.transaction.transactionStatus, new Date(), 'userId', '','' );
  this.requestService.fullRequest.push(fullRequest);
  this.ref2 = '';
  }

}
