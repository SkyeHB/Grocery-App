import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient, 
    private auth: AuthService) { }

  getUserCart(userid: number): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'get-cart/' + userid, 
      { token: this.auth.getToken() });
  }

  addCartItem(userid: number, productid: number): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'cart/' + userid, 
      { productId: productid, 
        token: this.auth.getToken() 
      });
  }

  updateCartItemQuantity(
    userid: number, 
    productid: number, 
    change: number): Observable<any> {
    
      return this.http.put<any>(
      environment.apiBaseUrl + 'cart/' + userid, 
      { productId: productid, 
        change: change, 
        token: this.auth.getToken() 
      });
  }

  emptyUserCart(userid: number): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'empty-cart/' + userid, 
      { token: this.auth.getToken() });
  }

  deleteCartItem(
    userid: number, 
    productid: number): Observable<any> {

    return this.http.post<any>(
      environment.apiBaseUrl + 'delete-cart-item/' + userid, 
      { productId: productid, 
        token: this.auth.getToken() 
      });
      
  }
}
