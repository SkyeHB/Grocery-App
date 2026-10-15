import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  getAllOrders(): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'get-orders',
      { token: this.auth.getToken() });
  }

  getOrderByID(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + `order-detail/${id}`,
      { token: this.auth.getToken() });
  }

  deleteOrderByID(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + `delete-unpaid-order/${id}`,
      { token: this.auth.getToken() });
  }

  getItemsOfOrderByID(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + `get-order-items/${id}`,
      { token: this.auth.getToken() });
  }

  updateOrderStatusByID(id: any, orderStatus: String): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'order-update/',
      {
        id: id,
        newstatus: orderStatus,
        token: this.auth.getToken()
      });
  }
  getOrderByUserID(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'my-orders',
      {
        id: id,
        token: this.auth.getToken()
      });
  }

  getOrderDetail(id: any): Observable<any> {
    return this.http.post<any>(
      environment.apiBaseUrl + 'order-view-detail',
      {
        id: id,
        token: this.auth.getToken()
      });
  }

}
