import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, User } from "./classes";
import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    // Retrieves the token from local storage, or null if it doesn't exist.
    //
    private getTokenFromLocalStorage(): string | null {
        var token = localStorage.getItem('access_token');

        // Sometimes the token is the string 'undefined' for some reason.
        // It should either exist as a token 
        // or not exist at all, so it's removed.
        //
        if (token === "undefined") {
            this.clearToken();
            token = null;
        };
        return token;
    }

    public getToken(): string | null {
        return this.getTokenFromLocalStorage();
    }

    getTokenAsString(): string {
        let token = this.getToken();
        return (token == null) ? "" : token;
    }

    public setToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    public readToken(): User | null {
        const token = this.getTokenFromLocalStorage();
        if (token) {
            return jwt_decode(token);
        } else {
            return null;
        }
    }

    public getLoggedInUserID(): number | null {

        let user = this.readToken();

        if (user && user.userid) {

            return user.userid;

        } else {

            return null;

        }
    }

    getLoggedInUserRole(): string {
        let user = this.readToken();
        if (user) {
            return user.userrole;
        } else {
            return "";
        }
    }

    isAuthenticated(): boolean {
        const token = this.getTokenFromLocalStorage();
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    isAdmin(): boolean {
        const token = this.getTokenFromLocalStorage();

        // Reurn false if the user isn't logged in
        //
        if (!token) {
            return false;
        }
        let user = this.readToken();
        if (!user) {
            return false;
        }

        // Return true of the user is an admin
        //
        return user.userrole === "admin";
    }

    clearToken(): void {
        localStorage.clear();
    }

    // log in a user
    login(user: User): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'login',
            { user: user.toJson() });
    }

    // Create a new user
    //
    register(user: User): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'register',
            { user: user.toJson() });
    }

    // Get all users
    //
    getAllUsers(): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'get-users',
            { token: this.getToken() });
    }

    // Get user of id
    //
    getUserById(id: string): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'get-user/' + id,
            { token: this.getToken() });
    }

    // Delete user of id
    //
    deleteUserById(id: number): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'delete-user/' + id,
            { token: this.getToken() });
    }

    clearUserCheckoutUuid(id: number): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + 'clear-user-checkout-uuid/' + id, { token: this.getToken() });
    }

    // Get all users
    //
    getAllProductsAdmin(): Observable<any> {
        return this.http.get<any>(
            environment.apiBaseUrl + 'inventory-admin');
    }

    getAllProducts(): Observable<any> {
        return this.http.get<any>(
            environment.apiBaseUrl + 'inventory');
    }

    // Get user of id
    //
    getProductById(id: string): Observable<any> {
        return this.http.get<any>(
            environment.apiBaseUrl + 'inventory/' + id);
    }

    // Delete user of id
    //
    deleteProductById(id: number): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'delete-inventory/' + id,
            { token: this.getToken() });
    }

    updateProductStatus(id: number): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'updateStatus-inventory/' + id,
            { token: this.getToken() });
    }

    addProduct(product: FormData): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'add-product',
            product);
    }

    editProductAdmin(product: Product): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'edit-product', { token: this.getToken(), product: product });
    }

    editProduct(product: Product): Observable<any> {
        return this.http.post<any>(
            environment.apiBaseUrl + 'editProduct',
            { product: product.toJson() });
    }
    requestImage(filename: string): Observable<any> {
        return this.http.get<any>(
            environment.apiBaseUrl + `uploads/${filename}`);
    }

    stripePayment(
        userId: number,
        cart: { id: number, quantity: number }[],
        deliveryDetails: { deliveryType: string, deliveryTime: string, deliveryLocation: string }
    ): Observable<any> {
        return this.http.post<any>(environment.apiBaseUrl + 'create-checkout-session', { token: this.getToken(), 'items': cart, 'userId': userId, 'deliveryDetails': deliveryDetails });
    }
}
