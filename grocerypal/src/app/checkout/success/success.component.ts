import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CartService } from 'src/app/cart.service';
import { OrdersService } from 'src/app/orders.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  loggedInUserId: number | null = null;
  user_checkout_uuid: string = "";

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    let orderId: string = this.route.snapshot.params['orderid'];
    let checkout_uuid: string = this.route.snapshot.params['uuid'];

    this.loggedInUserId = this.authService.getLoggedInUserID();

    if (this.loggedInUserId) {
      let userId = this.loggedInUserId;
      //retrieve the logged-in user's details
      this.authService.getUserById(`${userId}`).subscribe(
        response => {
          //if the user's checkout uuid matches the one in the url, payment was valid
          if (response.checkout_uuid == checkout_uuid) {
            //update the order's "status" field from "unpaid" to "not started"
            this.orderService.updateOrderStatusByID(orderId, "not started").subscribe(
              response => {
                console.log("(1/3) order created");
                //empty the user's cart
                this.cartService.emptyUserCart(userId).subscribe(
                  response => {
                    console.log("(2/3) cart cleared");
                    //set user's "checkout_uuid" field to null
                    this.authService.clearUserCheckoutUuid(userId).subscribe(
                      response => {
                        console.log("(3/3) user checkout uuid cleared");
                      }, error => {
                        console.log("error:", error.error);
                      }
                    );
                  }, error => {
                    console.log("error:", error.error);
                  }
                );
              }, error => {
                console.log("error:", error.error);
              }
            );
          }
        }, error => {
          console.log("error:", error.error);
        }
      );
    }
  }
}
