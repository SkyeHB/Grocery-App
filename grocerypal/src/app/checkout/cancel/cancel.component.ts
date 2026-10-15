import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { OrdersService } from 'src/app/orders.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {
  loggedInUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    let orderId: string = this.route.snapshot.params['orderid'];

    this.loggedInUserId = this.authService.getLoggedInUserID();

    if (this.loggedInUserId) {
      let userId = this.loggedInUserId;
      //delete unpaid order that was created
      this.orderService.deleteOrderByID(orderId).subscribe(
        response => {
          console.log("order cancelled");
        }, error => {
          console.log("error:", error.error);
        }
      );
      //set user's "checkout_uuid" field to null
      this.authService.clearUserCheckoutUuid(userId).subscribe(
        response => {
          //do nothing
        }, error => {
          console.log("error:", error.error);
        }
      );
    }
  }
}
