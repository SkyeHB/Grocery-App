import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { CartItem, CheckoutDetails } from '../classes';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  loggedInUserId: number | null = null;

  cart: Array<CartItem> = [];

  loadingCart: boolean = false;

  displayedColumns: string[] = ['name', 'price', 'quantity'];

  private cartSub: any;

  // Array of times for customers to select when ordering 
  // (populated in ngOnInit)
  //
  times: { value: string; time: string; }[] = [];

  // Holds the checkout details
  // default values set in ngOnInit
  //
  order: CheckoutDetails = new CheckoutDetails();
  authSub: any;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    // Retrieve the logged-in user's 
    // ID and navigate to products if not logged in
    //
    this.loggedInUserId = this.authService.getLoggedInUserID();

    if (!this.loggedInUserId) {

      this.router.navigate(['/products']);

    }

    // Set default order details
    //
    this.order.set("delivery", "0", "", 0.0);

    // Retrieve the user's cart (if a user is logged in)
    //
    if (this.loggedInUserId) {

      this.loadingCart = true;
      this.cartSub = this.cartService.getUserCart(this.loggedInUserId).subscribe(
        response => {

          this.loadingCart = false;

          // Add each cart item to the local cart
          //
          for (let cartItem of response.cart) {

            let newCartItem = new CartItem(
              cartItem.productid,
              cartItem.name,
              cartItem.quantity,
              cartItem.price,
              cartItem.discount);

            this.cart.push(newCartItem);
          }

          // Calculate total
          //
          this.order.total = this.getTotal();

        }, error => {
          console.log("error:", error.error);
          this.loadingCart = false;
        }
      );

      //set user's "checkout_uuid" field to null
      this.authService.clearUserCheckoutUuid(this.loggedInUserId).subscribe(
        response => {
          //do nothing
        }, error => {
          console.log("error:", error.error);
        }
      );
    }

    //Populate the array of order times
    let date = new Date();
    let currHour = date.getHours();
    this.order.time = `${currHour + 1}`;

    for (let hour = currHour + 1; hour <= 24; hour++) {
      //AM
      if (hour < 12) {
        this.times.push({
          value: `${hour}`,
          time: `${hour}:00 AM (today)`
        });
      }
      //PM
      else {
        this.times.push({
          value: `${hour}`,
          time: `${hour - 12}:00 PM (today)`
        });
      }

    }
  }

  // Verifies order fields and navigates to the payment screen
  goToPayment() {
    if (this.order.isValid() && this.loggedInUserId) {
      // Collect all cart items into the required format
      let cartJSON: { id: number, quantity: number }[] = [];
      for (let cartItem of this.cart) {
        cartJSON.push({ id: cartItem.productid, quantity: cartItem.quantity });
      }
      //console.log("Cart JSON:", cartJSON);

      //gather delivery details
      let deliveryDetails = {
        deliveryType: this.order.method,
        deliveryTime: ((+this.order.time) < 12) ? `${this.order.time}:00 AM` : `${(+this.order.time) - 12}:00 PM`,//ensure correct time format
        deliveryLocation: (this.order.method == "delivery") ? this.order.address : "N/A" //ensure there's no location if the method is pick-up
      };
      //console.log("delivery details:", deliveryDetails);

      // Stripe
      this.authSub = this.authService.stripePayment(this.loggedInUserId, cartJSON, deliveryDetails).subscribe(
        response => {
          //if successful
          console.log(response.url);
          //this.stripeUrl = response.url;
          window.location.href = response.url;

        }, error => {
          console.log("error:", error.error);
        }
      );
    }
  }

  // Calculate the total cart price
  //
  getTotal(): number {

    let price = 0.0;

    for (let cartItem of this.cart) {
      //get the singular price rounded to 2 decimals
      let singlePrice = Math.round((cartItem.price * cartItem.discount) * 100) / 100;
      //multiply the singular price by the quantity to get the total for the product (then add to total)
      price += cartItem.quantity * singlePrice;
    }

    return price;
  }

  toPrice(str: string | number) {

    return `$${(+str).toFixed(2)}`;

  }

  ngOnDestroy() {

    if (this.cartSub) this.cartSub.unsubscribe();

  }
}
