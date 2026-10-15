import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Product, categories } from '../classes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

export interface PeriodicElement {
  userfname: string;
  userlname: string;
  useremail: string;
  userrole: string;
}

export interface PeriodicElement {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  product = new Product();
  private authSub: any;
  products: PeriodicElement[] = [];
  currentProducts: PeriodicElement[] = [];
  displayedColumns: string[] = [
    'NO',
    'ID',
    'First Name',
    'Category',
    'Price',
    'Discount',
    'Quantity',
    'Actions',
  ];

  route: any;

  constructor(private auth: AuthService, _formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.authSub = this.auth.getAllProductsAdmin().subscribe(
      response => {
        //add category field using category_id and add it to the list of products
        for (let product of response.products) {
          product.category = 'DEFAULT';
          for (let c of categories) {
            if (c.id == product.category_id) {
              product.category = c.value;
            }
          }
          this.products.push(product);
        }
        this.changeProductPage(0);
      },
      error => { console.log("error:", error.error); }
    );

  }

  changeProductPage(start: number) {
    this.currentProducts = [];
    //end equals 10 indices after start, but if there are less than 10 remaininf after the start index, set end to the end of the array
    let end = (start + 10) < this.products.length ? start + 10 : this.products.length;
    //console.log("start:", start, "end:", end);
    for (let index = start; index < end; index++) {
      this.currentProducts.push(this.products[index])
    }
  }

  deleteProductById(id: number) {
    this.authSub = this.auth.deleteProductById(id).subscribe(
      response => {
        if (response.rowCount = 1) {
          //reload products
          this.products = [];
          this.ngOnInit();
        }
      }, error => {
        console.log("error:", error.error);
      }
    );
  }

  updateProductStatus(id: number) {
    this.authSub = this.auth.updateProductStatus(id).subscribe(
      response => {
        if (response.rowCount = 1) {
          //reload products
          this.products = [];
          this.ngOnInit();
          //show angular "snackbar"
          this.snackBar.open("Successfully toggled visibility", "Close", { duration: 5000 });
        }
      }, error => {
        console.log("error:", error.error);
      }
    );
  }

  //handles the paginator page switching
  switchPage(event?: PageEvent) {
    if (event) {
      this.changeProductPage(event?.pageIndex * event?.pageSize)
    }
  }

}
