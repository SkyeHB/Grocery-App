import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SharedVariablesService } from '../shared-variables.service';
import { OrdersService } from '../orders.service'

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
onOrderDetailRequest(arg0: any) {
  this.orderService.getOrderDetail(arg0).subscribe((x:any) => {
    this.currentOrder = x;
    console.log(this.currentOrder.orders)
  });
}

onPrevPage() {
  if(this.page > 0) {
    this.page -=1;
  }
}
onNextPage() {
  if(this.page < this.totalPages-1) {
    this.page +=1;
  }
}

  constructor(
    private auth: AuthService,    
    private router: Router, 
    private sharedVariables: SharedVariablesService,
    private orderService: OrdersService) { }

  userid :number = 0;
  orderids: any = []
  orderidsOnPage: any = []
  page: number = 0;
  totalPages: number = 0;
  pageElements: any = [[]];
  currentOrder: any = [];

  ngOnInit(): void {
    this.userid = this.auth.getLoggedInUserID()!

    this.orderService.getOrderByUserID(this.userid).subscribe( (x:any) => {
      
      this.orderids = x.orderids;
      
      this.totalPages = Math.ceil(this.orderids.length / 5);

      // Pagination code
      //
      var c = 0;
      var ar:any = [[]]
      var page = 0
      for(let i of this.orderids)
      {
        if(c < 5)
        {
          ar[page].push(i)
          c = c + 1;
        }
        else {
          ar.push([])
          page = page + 1
          c = 0;
        }
      }
      this.pageElements = ar;

    });
  }

}
