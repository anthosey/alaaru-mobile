import { Injectable } from '@angular/core';
import { User } from '../auth/model/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of, from, BehaviorSubject } from 'rxjs';
import { ErrorHandlingService } from './error-handling.service';

import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';
import { Plugins } from  '@capacitor/core';
import { AuthUSer } from '../auth/model/auth-user.model';

interface AllItemRes {
  status: string;
  data: {
          id: number,
          category: string,
          item_code: string,
          weight: string,
          item_name: string,
          online: string,
          weight_price: number,
          createdAt: Date,
          updatedAt: Date
      };
  }

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  // loggedInUser = new User('anthosey', '1234', 'anthosey@gmail.com', '08038094457', 'Oluseye', 'Ojewale', 2000, '38 Benue Crescent, Area 1, Garki Abuja');
  // user: User;
  url = "http://localhost:3000/createUser";

  private _userIsAuthenticated = false;

  signedIn: boolean;
  realUser: any;
  greeting: string;
  private _userName: string;
  username: string;
  private _loginAttempt = 0;
  myInit:any;
  // private _idToken = new BehaviorSubject<string>(null);
  private _token: string;

  private _loggedInUser = new BehaviorSubject<AuthUSer>(null);
  private loggedInUser: AuthUSer;
  private _userId = null;  

  constructor(private http: HttpClient,
    private errorHandingService: ErrorHandlingService,
    private amplifyService: AmplifyService) {

    }

  private storeAuthData (userId: string, email: string, token: string, tokenExpiryDate: Date, mobile: string, firstName: string) {
    const data = JSON.stringify({userId: userId, email: email, token: token, tokenExpiryDate: tokenExpiryDate, mobile: mobile, firstName: firstName});
    Plugins.Storage.set({key: 'authData', value: data});
  };

  autoLogin() {
    return from (Plugins.Storage.get({key: 'authData'}))
    .pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        userId: string;
        token: string;
        tokenExpiryDate: Date;
        email: string;
        mobile: string;
        firstName: string;
      };

      if (parsedData.tokenExpiryDate <= new Date()) {
        return null;
      }
      
      // console.log('parsedData: ' + parsedData.email, parsedData.mobile, parsedData.tokenExpiryDate, parsedData.userId, parsedData.token);
      
      const user = new AuthUSer(parsedData.token, parsedData.tokenExpiryDate, parsedData.email, parsedData.email, parsedData.mobile, parsedData.firstName, 'lastName');
      // this._loggedInUser = user;
      this._userIsAuthenticated = true;
      this._token = parsedData.token;

      return user;
      // return 
     }),
    tap(user => {
      if (user) {
        this._loggedInUser.next(user);
      }
    }),
    map (user => {
      return !!user;
    })
    );
  }

  set userName(userName: string) {
    this._userName = userName;
  }

  get token () {
    return this._token;
  }
  get userName() {
    return this._userName;
  }

  getLoggedInUser() {
    // this.amplifyService.auth.
    console.log('uService:' + this.loggedInUser.firstName);
    return this.loggedInUser;
  }

  get userIsAuthenticated() {
    return this._loggedInUser.asObservable()
    .pipe(map(user => {
      if (user) {
        // console.log('toking:' + user.tokenId);
        this.loggedInUser = user; // initialize a user in authService
        return !!user.tokenId;
      } else{
        this.loggedInUser = null; // initialize a user in authService
        return false;
      }
    }      
));
}

get userId() {
  return this._loggedInUser.asObservable()
  .pipe(map(user => {
    if (user) {
      // console.log('lgin user: ' + user.tokenId);
      return user.email;
    } else {
      return null;
    }
  }))
}

get idToken () {
  return this._loggedInUser.asObservable()
  .pipe(map(user => {
    if (user) {
      // console.log('tID:' + user.tokenId);
      return user.tokenId;
    } else {
      return null;
    }
  }))
}

  login(username: string, password: string) {
    
    return from(Auth.signIn(username, password))
      // .pipe(tap(this.setUserData.bind(this)));
      .pipe(tap(data => {
    
        const idToken = data.signInUserSession.idToken.jwtToken;
        const tokenExpiry = data.signInUserSession.idToken.payload.exp;
        const mobile = data.attributes["phone_number"];
        const email =  data.attributes["email"];
        const firstName = data.attributes["given_name"];
        
        // console.log('tokID_auth' + idToken);
        const time = new Date().getTime();
        const tokenExpDate = new Date(time + (tokenExpiry + 1000));
        
        
        this.storeAuthData(email,email,idToken, tokenExpDate, mobile, firstName); // store login details in device memory
        const user = new AuthUSer(idToken, tokenExpDate, email, email, mobile, firstName, 'lastName');
        // Set the logged in user property in the auth service to the new user
        // console.log('test_in_auth: ' + user.tokenId);
        this._token = idToken; // set token property
         this._loggedInUser.next(user);
         
        // this._userIsAuth        
      }))
  }

  
  logout() {
    this._loggedInUser.next(null);
    Plugins.Storage.remove({ key: 'authData'});

    return from(Auth.signOut())
      .pipe(map(data => {
        this._userIsAuthenticated = false;
        return 'SUCCESS';

      },
        err => {
          console.log(err.message);
        }));
  }


  signup(data: any) {
    const username = data.email;
    const password = data.password;
    const email = data.email;
    const phone_number = data.mobile;
    const firstName = data.firstName;
    const lastName = data.lastName;

    return from(Auth.signUp({
      username,
      password,
      attributes: {
        email,          // optional
        phone_number,   // optional - E.164 number convention
        // attributeList,// other custom attributes 
        'given_name': firstName , 'family_name' : lastName,
      },
      validationData: []  //optional
    }))

      .pipe(map(data => {
        // console.log(data);
        this.username = data.user.getUsername();
        return { status: data.userConfirmed, username: data.user.getUsername() }
      },
        err => {
          console.log('err Service:' + err.message);
          return err.message;
        }));
  }

  verifyAccount(username: string, code: string) {
    // After retrieving the confirmation code from the user
    console.log(username + ',' + code);
    // return;
    const myCode = String(code);
    const usern = String(username);
    // return from (Auth.confirmSignUp('anthosey@gmail.com', '799399', {
    return from(Auth.confirmSignUp(usern, myCode, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true
    })).pipe(map(data => {
      console.log('from service: ' + data);
      return data
    },
      err => {
        console.log('err Service:' + err.message);
        return err.message;
      }));
  }

  resendVerificationCode(username: string) {
    const usern = String(username);
    return from(Auth.resendSignUp(usern)
    ).pipe(map(data => {
      console.log('from service: ' + data);
      return data;
    },
      err => {
        console.log('err Service:' + err.message);
        return err.message;
      }));
  }


  changePassword(oldPass: string, newPass: string) {
    return from(Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, oldPass, newPass)

      }))
      .pipe(map(data => {
        return data;
      }))
  }


  preResetCheck(username: string) {
    return from(Auth.forgotPassword(username))

      .pipe(map(data => {
        console.log(data);
        return data;
      }))
  }

  resetPassword(usr: string, cod: string, newP: string) {
    const username = String(usr);
    const code = String(cod);
    const newPassword = String(newP);
    return from(Auth.forgotPasswordSubmit(username, code, newPassword))
      .pipe(map(data => {
        console.log(data);
        return data;
      }))
  }

}
