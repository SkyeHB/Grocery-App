import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../classes';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  // Boolean for password being hidden or not
  hide: boolean = true;
  // User object synced with form fields
  product: Product = new Product;
  errorMessage: string = "";
  isFormError: boolean = false;
  private authSub: any;

  categories: { id: number, value: String }[] = [
    { id: 1, value: "Fruit" },
    { id: 2, value: "Vegetable " },
    { id: 3, value: "Bread " },
    { id: 4, value: "Meat" },
    { id: 5, value: "Frozen Food" },
    { id: 6, value: "Cereal " },
    { id: 7, value: "Dairy " }
  ];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.populateProductFields();
  }

  onSubmit(): void {
    //reset error
    this.errorMessage = ""
    this.isFormError = false;
    //attept change
    this.auth.editProductAdmin(this.product).subscribe((response) => {
      if (response.product) {
        //if successful, route back to the product details page
        //this.router.navigate([`/product_detail/${response.product.id}`]);
        this.router.navigate(["/inventory"]);
      } else {
        //set error
        this.errorMessage = "Ensure all fields have a value"
        this.isFormError = true;
      }
    });
  }

  populateProductFields() {
    let id: string = this.route.snapshot.params['id'];
    this.auth.getProductById(id).subscribe((p) => {
      this.product = p.product;
    });

  }
}
