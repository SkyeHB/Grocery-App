import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductDetailComponent } from './product-detail/product-detail.component'
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { AuthGuard } from './auth.guard';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { SuccessComponent } from './checkout/success/success.component';
import { CancelComponent } from './checkout/cancel/cancel.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
//Routes
const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'products',
        component: ProductsComponent,
    },
    {
        path: 'product_detail/:id',
        component: ProductDetailComponent
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: 'my-orders',
        component: MyOrdersComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['user', 'admin']
        }
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'user-details/:id',
        component: UserDetailsComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'addProduct',
        component: AddProductComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'add-product/:id',
        component: AddProductComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'orders',
        component: ViewOrdersComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['user', 'admin']
        }
    },
    {
        path: 'checkout/success/:orderid/:uuid',
        component: SuccessComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['user', 'admin']
        }
    },
    {
        path: 'checkout/cancel/:orderid',
        component: CancelComponent,
    },
    {
        path: 'order-detail/:id',
        component: OrderDetailComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        path: 'product-edit/:id',
        component: ProductEditComponent,
        canActivate: [AuthGuard],
        data: {
            requiredRoles: ['admin']
        }
    },
    {
        // Keep this route at the bottom (the end of this "routes" array)
        //
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
