import { Component, inject, OnInit, Output } from '@angular/core';
import { MenuLogin } from '../../shared/interfaces/menu-login';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { MenuEntry } from '../../shared/interfaces/menu-entry';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../shared/interfaces/customer';
import { CustomersService } from '../../shared/services/customers.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoggedInUser, User } from '../../shared/interfaces/java-backend';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { effect } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ProductFilters } from '../../shared/interfaces/java-backend';
import { FilterService } from '../../shared/services/filter.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/interfaces/product';




@Component({
  selector: 'app-header',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
   
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    @Output() filtersChanged = new EventEmitter<ProductFilters>();
  
    productService = inject(ProductService);
    route = inject(ActivatedRoute);
    filterService = inject(FilterService);
    
    cdr = inject(ChangeDetectorRef)
    router = inject(Router)
    userService = inject(UserService);  
    customerService = inject(CustomersService)
    
    userRole: string | undefined; 

    filters: ProductFilters = {};
    products: Product[] = [];
    
    user = this.userService.user;    
    customer: Customer | undefined
    userUuid: string = this.user()?.userUuid || '';
    

    formCustomerUuid = new FormGroup({
        uuid: new FormControl(''),
      });


    productFiltersForm = new FormGroup({
        name: new FormControl(''),
      });



    ngOnInit(): void {
      this.createUser();   
      this.fetchCustomerByUserUuid();  
      this.productFiltersForm.valueChanges.subscribe((filters) => {        
      });
      this.fetchProducts();   
     
    }

    menu: MenuLogin[] = [
        { text: "Login", routerLink: "login"},
        { text: "Signed Up", routerLink: "sign-up"},
    ] 

    menuCustomer: MenuEntry[] = [
      { text: "Ο Λογαριασμός μου", routerLink: "customer-details"},
      { text: "Οι παραγγελίες μου", routerLink: "customer-orders"},


    ]

    menuAdmin: MenuEntry[] = [
      { text: "See Customers", routerLink: "customer-List-All"},
      { text: "Add Product", routerLink: "add-product"},
    ]

    

    logout() {
      this.userService.logoutUser()
    }

    fetchCustomerByUserUuid(): void {
      
      this.formCustomerUuid.patchValue({
        uuid: this.userUuid
      });
  
      const customerData = this.formCustomerUuid.value;
      this.customerService.getCustomerByUserUuid(customerData).subscribe({
        next: (response) => {
          console.log('Customer fetched successfully:', response);
          this.customer = response 
          console.log('Customer fetched successfully:', this.customer);
        },
        error: (error) => {
          console.error('Error fetching customer:', error);
        },
      });
    }


    createUser(){
      effect(() => {
        const user = this.userService.user
        this.userRole = this.user()?.role;
        console.log('Role updated:', this.userRole);
        this.cdr.detectChanges(); // Ενημερώνει το template
      });
      
    }

    toCart() {
      this.router.navigate(['/cart']);
    }

    trackByText(index: number, item: { text: string }): string {
      return item.text;
    }

   

    fetchProducts(): void {
      const filters = this.productFiltersForm.value
      if (filters.name) {
        this.productService.getProductsFiltered(filters).subscribe({
          next: (response) => {
            console.log('Products fetched successfully:', response);
            this.products = response.data || [];
  
          },
          error: (error) => {
            console.error('Error fetching products:', error);
          },
        });
      }
     else {
      this.products = []
    }
  }
      
      
}