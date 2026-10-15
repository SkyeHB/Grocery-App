import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Product } from '../classes';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    productsOnSale: Array<Product> = [];

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        // Retrieve all the products
        this.authService.getAllProducts().subscribe(
            response => {
                // Add each product to the list as a Product type
                let tempProducts: Array<Product> = [];
                for (let product of response.products) {
                    // Create a new Product object
                    let newProduct = new Product();
                    newProduct.loadData(product);
                    // Append the new product object if valid
                    if (newProduct.isValid && newProduct.isOnSale()) {
                        tempProducts.push(newProduct);
                    }
                }
                //sort from highest to lowest discount
                tempProducts.sort((product1, product2) =>
                    (product1.discount > product2.discount) ? 1 : ((product2.discount > product1.discount) ? -1 : 0)
                );
                //if more than 4, keep only the best 4
                while (tempProducts.length > 4) {
                    tempProducts.pop();//keeps removing the last until there is 4
                }
                // Set the products on sale all at once
                this.productsOnSale = tempProducts;
            }, error => {
                console.log("error:", error.error);
            }
        );
    }

    toPrice(str: string | number) {
        return `$${(+str).toFixed(2)}`;
    }

    getImage(filename: string) {
        return `${environment.apiBaseUrl}uploads/${filename}`
    }
}
