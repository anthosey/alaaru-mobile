import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FundService } from '../services/fund.service';
import { Router } from '@angular/router';
import { AuthUSer } from '../auth/model/auth-user.model';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-fund-wallet',
  templateUrl: './fund-wallet.page.html',
  styleUrls: ['./fund-wallet.page.scss'],
})
export class FundWalletPage implements OnInit {
user: AuthUSer;
  constructor(private fundService: FundService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    console.log('U' + this.user.firstName);
    return;
  }

  onProceed(f: NgForm) {
    console.log('Amount: ' + f.value.amount);
    this.fundService.transactionAmount = f.value.amount;
    this.fundService.transactionTitle = 'Fund Wallet';
    this.router.navigateByUrl('/fund-wallet/process-fund')
  }
}
