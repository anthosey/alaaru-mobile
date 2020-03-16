import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'start-alaaru/addresses', pathMatch: 'full' },

  {
    path: 'new-request',
    children: [{
                  path: '',
                  loadChildren: () => import('./new-request/new-request.module').then( m => m.NewRequestPageModule)
              },
              {
                  path: ':ref',
                  loadChildren: () => import('./new-request/payment/payment.module').then( m => m.PaymentPageModule)
                }]
  },
  {
    path: 'vehicle-types',
    loadChildren: () => import('./vehicle-types/vehicle-types.module').then( m => m.VehicleTypesPageModule)
  },
  {
    path: 'inside',
    children: [{
          path: '',
          loadChildren: () => import('./inside/inside.module').then( m => m.InsidePageModule),
          canLoad: [AuthGuard]
        },
        {
          path: ':ref',
          loadChildren: () => import('./inside/details/details.module').then( m => m.DetailsPageModule)
          
        }]
  },
  
  {
    path: 'fund-wallet',
    loadChildren: () => import('./fund-wallet/fund-wallet.module').then( m => m.FundWalletPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'buy-airtime',
    loadChildren: () => import('./buy-airtime/buy-airtime.module').then( m => m.BuyAirtimePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'item-tracking',
    loadChildren: () => import('./item-tracking/item-tracking.module').then( m => m.ItemTrackingPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'amplify-login',
    loadChildren: () => import('./auth/amplify-login/amplify-login.module').then( m => m.AmplifyLoginPageModule)
  },
  {
    path: 'email-verify',
    loadChildren: () => import('./auth/email-verify/email-verify.module').then( m => m.EmailVerifyPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./auth/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'reset-confirm',
    loadChildren: () => import('./auth/reset-confirm/reset-confirm.module').then( m => m.ResetConfirmPageModule)
  },
  {
    path: 'start-alaaru',
    children: [{
          path: '',
          loadChildren: () => import('./start-alaaru/start-alaaru.module').then( m => m.StartAlaaruPageModule),
          canLoad: [AuthGuard]
        },
        {
          path: ':addresses',
          loadChildren: () => import('./start-alaaru/addresses/addresses.module').then( m => m.AddressesPageModule)       
        },
        {
          path: 'locations',
          loadChildren: () => import('./start-alaaru/locations/locations.module').then( m => m.LocationsPageModule)
        }]
    
  },
  // {
  //   path: 'payment',
  //   loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  // },
  // {
  //   path: 'addresses',
  //   loadChildren: () => import('./start-alaaru/addresses/addresses.module').then( m => m.AddressesPageModule)
  // },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
