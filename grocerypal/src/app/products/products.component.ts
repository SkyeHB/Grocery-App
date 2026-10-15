import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { environment } from 'src/environments/environment';
import { CartItem, Product, status } from '../classes';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  loggedInUserId: number | null = null;
  products: Array<Product> = []; // get data about products
  cart: Array<CartItem> = [];
  loadingCart: boolean = false;
  private authSub: any;
  private cartSub: any;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router) { }

  searchText: String = "";

  ngOnInit(): void {
    // Retrieve the logged-in user's ID
    this.loggedInUserId = this.authService.getLoggedInUserID();
    // Retrieve all the products
    this.authSub = this.authService.getAllProducts().subscribe(
      response => {
        // Add each product to the list as a Product type
        let tempProducts: Array<Product> = [];
        for (let product of response.products) {
          // Create a new Product object
          let newProduct = new Product();
          newProduct.loadData(product);
          // Append the new product object if valid
          if (newProduct.isValid) {
            tempProducts.push(newProduct);
          }
        }
        // Set the products being viewed
        this.products = tempProducts;
      }, error => {
        console.log("error:", error.error);
      }
    );

    // Retrieve the user's cart 
    // (if a user is logged in)
    //
    if (this.loggedInUserId) {
      this.loadingCart = true;
      this.cartSub = this.cartService.getUserCart(this.loggedInUserId).subscribe(
        response => {
          //add each cart item to the local cart
          for (let cartItem of response.cart) {
            let newCartItem = new CartItem(
              cartItem.productid,
              cartItem.name,
              cartItem.quantity,
              cartItem.price,
              cartItem.discount
            );
            this.cart.push(newCartItem);
          }
          this.loadingCart = false;
        }, error => {
          console.log("error:", error.error);
          this.loadingCart = false;
        }
      );
    }
  }

  addItemToLocalCart(productid: number, name: string, price: number, discount: number) {
    let exists = false;
    for (let i = 0; i < this.cart.length; i++) {
      //if the product is already in the cart...
      if (this.cart[i].productid == productid) {
        //add 1 to the quantity
        this.cart[i].quantity = this.cart[i].quantity + 1;
        exists = true;
        break;
      }
    }
    //if the product is not in the cart...
    if (!exists) {
      //add the product to the cart
      let cartItem = new CartItem(productid, name, 1, price, discount);
      this.cart.push(cartItem);
    }
  }

  // Adds a product to the cart
  addToCart(productId: number) {
    // Ensure there is a logged-in user
    if (this.loggedInUserId) {
      // Search for the product using the id
      for (let product of this.products) {
        if (product.id == productId) {
          // Add the product to the database cart
          this.cartSub = this.cartService.addCartItem(this.loggedInUserId, product.id).subscribe(
            response => {
              //if successful
              if (response.status == status.OKAY) {
                console.log("cart update saved");
                // Add the product to the local cart as a CartItem type
                this.addItemToLocalCart(product.id, product.name, Number(product.price), Number(product.discount));
              }
              //if unsuccessful
              else {
                console.log("database did not save the cart update");
              }
            }, error => {
              console.log("error:", error.error);
            }
          );
          break;
        }
      }
    }
    //if the user is not logged on
    else {
      //redirect ot login page
      this.router.navigate(['/login']);
    }
  }

  updateCartItemQuantity(productId: number, change: number) {
    // Ensure there is a logged-in user
    if (this.loggedInUserId) {
      // Get the cart item details
      let index = -1;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].productid == productId) {
          index = i;
          break;
        }
      }
      // Check if the item exists 
      // and the quantity will be valid after it changes
      if (index >= 0 && (this.cart[index].quantity + change) > 0) {
        // Update the database cart
        this.cartSub = this.cartService.updateCartItemQuantity(this.loggedInUserId, productId, change).subscribe(
          response => {
            //if successful
            if (response.status == status.OKAY) {
              // Update the local cart
              // change is either 1 or -1
              this.cart[index].quantity = this.cart[index].quantity + change;
              console.log("cart update saved");
            }
            //if unsuccessful
            else {
              console.log("database did not save the cart product quantity update");
            }
          }, error => {
            console.log("error:", error.error);
          }
        );
      }
    }
  }

  deleteCartItem(productId: number) {
    //ensure there is a logged-in user
    if (this.loggedInUserId) {
      this.cartSub = this.cartService.deleteCartItem(this.loggedInUserId, productId).subscribe(
        response => {
          //if successful
          if (response.status == status.OKAY) {
            // Delete from the local cart
            for (let i = 0; i < this.cart.length; i++) {
              if (this.cart[i].productid == productId) {
                this.cart.splice(i, 1);
                break;
              }
            }
          }
          //if unsuccessful
          else {
            console.log("database did not save the product deletion from cart");
          }
        }, error => {
          console.log("error:", error.error);
        }
      );
    }
  }

  // Clears the user's cart (if a user is logged in)
  emptyCart() {
    if (this.loggedInUserId) {
      // Empty the cart on the database
      this.cartSub = this.cartService.emptyUserCart(this.loggedInUserId).subscribe(
        response => {
          console.log("cart update saved");
          // Empty the local cart
          this.cart = [];
        }, error => {
          console.log("error:", error.error);
        }
      );
    }
  }

  // Calculate the total cart price
  getTotal(): string {
    let price = 0.0;
    for (let cartItem of this.cart) {
      //get the singular price rounded to 2 decimals
      let singlePrice = Math.round((cartItem.price * cartItem.discount) * 100) / 100;
      //multiply the singular price by the quantity to get the total for the product (then add to total)
      price += cartItem.quantity * singlePrice;
    }
    return price.toFixed(2);
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  toPrice(str: string | number) {
    return `$${(+str).toFixed(2)}`;
  }

  getImage(filename: string) {
    return `${environment.apiBaseUrl}uploads/${filename}`
  }
}
