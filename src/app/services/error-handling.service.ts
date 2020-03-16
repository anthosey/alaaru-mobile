import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }
  
  handleError(err: any) {
    if (err.status === 404) {
      return {status: "error", message: err.status + ' Not found'};
    } else if (err.status === 400) {
      return {status: "error", message: err.status + 'Bad Request'};
    } else if (err.status === 450) {
      return {status: "error", message: err.status + ' Server Errors ' + err.message}
    }
    else return {status: 'error', message: 'unexpected Error occured'} 
    }
}
