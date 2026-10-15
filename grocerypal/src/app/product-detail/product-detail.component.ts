import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, Product, categories } from '../classes';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  product: Product | null = null;
  ngOnInit(): void {
    let productid: string = this.route.snapshot.params['id'];
    this.authService.getProductById(productid).subscribe(
      response => {
        //set the products being viewed
        let nProduct = new Product();
        nProduct.loadData(response.product);
        //add category field using category_id
        nProduct.category = "DEFAULT";
        for (let c of categories) {
          if (c.id == response.product.category_id) {
            nProduct.category = c.value;
          }
        }
        this.product = nProduct;
      }, error => {
        console.log("error:", error.error);
      }
    );
  }

  getImage(filename: string) {
    return `${environment.apiBaseUrl}uploads/${filename}`
  }

  // To show edit button only if admin is logged in
  //
  isAdmin(): Boolean {
    return this.authService.getLoggedInUserRole() == "admin"
  }

  // When use click the edit button on product detail
  //
  onEdit() {
    let productid: Number = this.route.snapshot.params['id'];
    this.router.navigate([`product-edit/${productid}`]);
  }

  toPrice(str: string | number) {

    return `$${(+str).toFixed(2)}`;

  }

}
