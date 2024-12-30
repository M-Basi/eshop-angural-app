import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ProductsListAdminComponent } from './components/products-list-admin/products-list-admin.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProductFullPageComponent } from './components/product-full-page/product-full-page.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CustomersViewAdminComponent } from './components/customers-view-admin/customers-view-admin.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { SaveCustomerInfoComponent } from './components/customer-details/save-customer-info/save-customer-info.component';
import { SavePaymentInfoComponent } from './components/customer-details/save-payment-info/save-payment-info.component';
import { SaveCustomerPersonalInfoComponent } from './components/customer-details/save-customer-personal-info/save-customer-personal-info.component';
import { UpdatePaymentInfoComponent } from './components/customer-details/update-payment-info/update-payment-info.component';
import { UpdateCustomerPersonalInfoComponent } from './components/customer-details/update-customer-personal-info/update-customer-personal-info.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';


export const routes: Routes = [
    
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'carousel', component: WelcomeComponent }, 
    { path: 'login', component: UserLoginComponent },
    { path: 'sign-up', component: UserRegistrationComponent },
    { path: 'product-List-All', component: ProductsListAdminComponent },
    { path: 'product-Full-View', component: ProductFullPageComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'customer-List-All', component: CustomersViewAdminComponent },
    { path: 'product-Update', component: UpdateProductComponent },
    { path: 'customer-details', component: CustomerDetailsComponent },
    { path: 'customerInfo - save', component: SaveCustomerInfoComponent },
    { path: 'paymentInfo - save', component: SavePaymentInfoComponent },
    { path: 'customerPersonalInfo - save', component: SaveCustomerPersonalInfoComponent },
    { path: 'paymentInfo - update', component: UpdatePaymentInfoComponent },
    { path: 'customer - Personal - Info - update', component: UpdateCustomerPersonalInfoComponent },
    { path: 'customer-orders', component: CustomerOrdersComponent },
    { path: 'cart', component: CartComponent},
    { path: 'contact - site', component: ContactComponent},
 

  
    
    
];