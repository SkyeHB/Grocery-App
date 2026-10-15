import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

export interface Order {
  orderid: number;
  userid: number;
  date: string;
  totalprice: number;
  delivery_type: string;
  delivery_time: string;
  delivery_location: string;
  status: string;
}

interface OrderItem {
  orderproductid: number;
  orderid: number;
  productid: number;
  quantity: number;
  product_cost: number;
  product_name: number;
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  items: OrderItem[] = [];
  id: Number = 0;
  updatedStatus: any;

  constructor(
    private orders: OrdersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //retrieve id from url
    this.id = this.route.snapshot.params['id'];
    //Get order details by ID
    this.orders.getOrderByID(this.id).subscribe(
      response => {
        let temp = response.order;
        temp.date = temp.date.substring(0, 10);//change date to the wanted format
        this.order = temp;
        //Get the order's items
        this.orders.getItemsOfOrderByID(this.id).subscribe(
          response => {
            this.items = response.items;
          },
          error => {
            console.log("error:", error.error);
          });
      },
      error => {
        console.log("error:", error.error);
      });
  }

  onSubmit() {
    let validStatus = (this.updatedStatus == "not started" || this.updatedStatus == "in progress" || this.updatedStatus == "serviced");
    if (validStatus) {
      this.orders.updateOrderStatusByID(this.id, this.updatedStatus).subscribe(
        response => {
          console.log("updateOrderStatusByID updated");
          //set local status
          if (this.order) this.order.status = this.updatedStatus;
        }, error => {
          console.log("error:", error.error);
        }
      );
    } else {
      console.log("Invalid status");
    }
  }
}
