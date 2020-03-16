import { Component, OnInit } from '@angular/core';
import { FundService } from '../../services/fund.service';
import { Transaction } from '../transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-fund',
  templateUrl: './process-fund.page.html',
  styleUrls: ['./process-fund.page.scss'],
})
export class ProcessFundPage implements OnInit {
transactionAmount: number;
transactionTitle: string;
transaction: Transaction;
  constructor(private fundService: FundService,
              private router: Router) { }

  ngOnInit() {
    this.transaction = this.fundService.getRefNumber();
  }

  ionViewDidEnter() {
    
  }

  onSubmitPay() {
    this.fundService.submitPayment();
    this.router.navigateByUrl('/inside');
  }
}
