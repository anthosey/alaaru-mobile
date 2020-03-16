import { Injectable } from '@angular/core';
import { Transaction } from '../fund-wallet/transaction.model';
import { RequestService } from './request.service';
import { FullRequest } from '../new-request/full-request.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FundService {

  private _transactionAmount: number;
  private _trasnactionTitle: string;
  ref2: string;

  transaction: Transaction;
  transactionDesc: string;
  constructor(private requestService: RequestService) { }

  get transactionAmount (){
    return this._transactionAmount;
  }

  set transactionAmount (amnt: number){
    this._transactionAmount = amnt;
  }

  get transactionTitle (){
    return this._trasnactionTitle;
  }

  set transactionTitle (txn: string){
    this._trasnactionTitle = txn;
  }

  getRefNumber() {
  // initiate transaction on the server and get a ref number
  if (!this.ref2)  {const ref = Math.floor((Math.random() * 30) + 1);
    this.ref2 = 'FW_100' + ref;
}
  this.transactionDesc = "Wallet funding. Amount: " + this._transactionAmount;
  this.transaction = new Transaction(this.ref2, this._trasnactionTitle, this._transactionAmount, 'Waiting', this.transactionDesc, 'Unpaid');
  return this.transaction;
}

submitPayment() {
  // submit transaction to the server, then call payment gateway

const fullRequest = new FullRequest(this.transaction.transactionTitle, '', '', '', false, '', '', 0, 0, '', new Date(), new Date(), 0, 0, 0, 0,this.transaction.transactionDescription, '', '','', 'user.name', 'user.mobile','user.email', this.transaction.transactionAmount, this.transaction.transactionRef,this.transaction.paymentStatus, this.transaction.transactionStatus, new Date(), 'userId', '','' );
this.requestService.fullRequest.push(fullRequest);
this.ref2 = '';
}
}
