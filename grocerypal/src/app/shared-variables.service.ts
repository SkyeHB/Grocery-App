import { Injectable } from '@angular/core';
import { CheckoutDetails } from './classes';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
  //field values for checkout details
  checkoutDetails = {
    method: "",
    time: "",
    address: "",
    total: 0.0
  }
  //public checkoutDetails: CheckoutDetails = new CheckoutDetails();

  constructor() { }

  clearCheckoutDetails() {
    this.checkoutDetails.method = "";
    this.checkoutDetails.time = "";
    this.checkoutDetails.address = "";
  }
}
