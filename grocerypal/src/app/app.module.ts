//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu'; 
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
// import { ViewOrderComponent } from './view-order/view-order.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductDetailComponent } from './product-detail/product-detail.component'

// import { MatCardModule } from '@angular/material/card';
// import { MatGridListModule } from '@angular/material/grid-list';
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CommonModule } from '@angular/common';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { SuccessComponent } from './checkout/success/success.component';
import { CancelComponent } from './checkout/cancel/cancel.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';



@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NotFoundComponent,
        ProductsComponent,
        AboutComponent,
        LoginComponent,
        SignupComponent,
        ProductDetailComponent,
        UsersComponent,
        UserDetailsComponent,
        AddProductComponent,
        InventoryComponent,
        ViewOrdersComponent,
        CheckoutComponent,
        PaymentComponent,
        OrderDetailComponent,
        ProductEditComponent,
        SuccessComponent,
        CancelComponent,
        MyOrdersComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatListModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatPaginatorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
