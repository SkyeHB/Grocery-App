import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CheckoutDetails } from '../classes';
import { SharedVariablesService } from '../shared-variables.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  loggedInUserId: number | null = null;
  //holds the checkout details
  order: CheckoutDetails = new CheckoutDetails();

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private sharedVariables: SharedVariablesService) { }

  ngOnInit(): void {
    
    // Retrieve the logged-in user's ID and navigate to products if not logged in
    //
    this.loggedInUserId = this.authService.getLoggedInUserID();
    
    if (!this.loggedInUserId) {
    
      this.router.navigate(['/products']);
    
    }

    // Get the checkout details from the shared variables then clear it
    //
    this.order.setFromJSON(this.sharedVariables.checkoutDetails);
    this.sharedVariables.clearCheckoutDetails();
    
    // Redirect to products if there are no (valid) order details
    //
    if (!this.order.isValid()) {
    
      this.router.navigate(['/products']);
    
    }
  }

  toPrice(str: string | number) {
    return `$${(+str).toFixed(2)}`;
  }

  toTime(hour: string): string {
    
    let time: number = 0;

    // Convert to number
    //
    time = +hour;
    
    // AM
    //
    if (time < 12) return `${time}:00 AM`;
    
    // PM
    //
    else return `${time - 12}:00 PM`;
  }
}
