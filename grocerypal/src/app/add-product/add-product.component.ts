import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Product, categories } from '../classes';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
    // Boolean for password being hidden or not
    hide: boolean = true;
    // User object synced with form fields
    product: Product = new Product;
    errorMessage: string = "";
    isFormError: boolean = false;
    private authSub: any;
    categories = categories;//local = external

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private routing: Router) { }

    ngOnInit(): void {

        if (this.route && this.route.snapshot.params['id'] != undefined) {

            let productid: string = this.route.snapshot.params['id'];
            this.authSub = this.auth.getProductById(productid).subscribe(
                response => {

                    this.product = response;

                }, error => {
                    console.log("error:", error.error);
                }
            );
        }

    }

    onFileSelected(event: Event) {

        // Retrieve selected file list
        //
        let files = (<HTMLInputElement>event.target).files;

        // Check if there is at least 1 file
        //
        if (files && files.length > 0) {

            // Set the first file
            //
            this.product.image = files[0];
        } else {
            console.log("file not selected");
        }
    }

    // Upon the user clicking the signup button
    onSubmit(): void {
        this.isFormError = false;
        // Validate form
        if (!(this.product.name.length > 0) ||
            !(this.product.category_id > 0) ||
            !(this.product.name.length < 30)) {

            this.errorMessage = "Invalid form";
            this.isFormError = true;
            return;
        }

        let formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('category_id', this.product.category_id.toString());
        formData.append('price', this.product.price);
        formData.append('quantity', this.product.quantity);
        formData.append('description', this.product.description);
        formData.append('image', this.product.image);

        this.auth.addProduct(formData).subscribe(
            response => {
                if (response.status == 201) {
                    // Redirect to products page
                    this.routing.navigate(["/inventory"]);
                }
            },
            error => {
                console.log("error:", error.error);
            }
        );
    }
}
