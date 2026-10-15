import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'

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

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})

export class ViewOrdersComponent implements OnInit {

  private ordersSub: any;
  orders: Order[] = [];
  displayedColumns: string[] = [
    'NO',
    'Order ID',
    'User ID',
    'Date',
    'Total',
    'Method',
    'Time',
    'Location',
    'Status',
    'Actions'
  ];

  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.ordersSub = this.orderService.getAllOrders().subscribe(
      response => {
        //temporary order list
        let temp: Order[] = response.orders;
        // Sort to prevent listing being unordered
        temp.sort((a: Order, b: Order) => {
          return a.orderid >= b.orderid ? 1 : -1
        });
        //change dates to the wanted format
        for (let order of temp) {
          order.date = order.date.substring(0, 10);
        }
        //set the orders
        this.orders = temp;
      }, error => {
        console.log("error:", error.error);
      }
    );
  }
}