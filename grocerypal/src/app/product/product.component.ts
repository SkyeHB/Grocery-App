import { Component, OnInit } from '@angular/core';
import { product_detail } from '../product_detail';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor() { }
  product: product_detail = {
    id: 1,
    name: "Apple",
    price: 1.3
  }
  ngOnInit(): void {
  }

}
