import { Component, OnInit } from '@angular/core';
import { AirtimeService } from '../../services/airtime.service';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/fund-wallet/transaction.model';

@Component({
  selector: 'app-process-airtime',
  templateUrl: './process-airtime.page.html',
  styleUrls: ['./process-airtime.page.scss'],
})
export class ProcessAirtimePage implements OnInit {
mobile: string;
amount: number;
networkProvider: string;
transaction: Transaction;
transactionRef: string;
  constructor(private airtimeService: AirtimeService,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.amount = this.airtimeService.amount;
    this.mobile = this.airtimeService.mobile;
    this.networkProvider = this.airtimeService.networdProvider;
    this.transaction = this.airtimeService.getRefNumber();
    this.transactionRef = this.transaction.transactionRef;
    console.log(this.transaction.transactionRef);

  }
  onProceed(f: NgModel) {
    console.log('MObile:' + f.value.mobile);
    console.log('amount:' + f.value.amount);
    console.log('Ntwk:' + this.networkProvider);
    this.airtimeService.submitPayment();
    this.router.navigateByUrl('/inside');
  }

  onChange() {
    console.log('Changed');
    this.router.navigateByUrl('/buy-airtime');
  }
}
