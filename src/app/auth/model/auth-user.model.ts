export class AuthUSer {
    constructor(public tokenId: string,
                public tokenExpiryDate: Date,
                public username: string,
                public email: string,
                public mobile: string,
                public firstName: string,
                public lastName: string) {}


        // expirationTime = new Date(this.tokenExpiryDate);
      

// get tokenId() {
    // if (!this.tokenExpiryDate || this.tokenExpiryDate <= new Date()) {
    //     return null;
    //   }
    //   return this._tokenId;
// };

}