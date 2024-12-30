import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../shared/interfaces/order';
import { OrderComponent } from '../order/order.component';
import { CustomersService } from '../../shared/services/customers.service';
import { UserService } from '../../shared/services/user.service';
import { CustomerUuidService } from '../../shared/services/customer-uuid.service';
import { Customer } from '../../shared/interfaces/customer';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderItem } from '../../shared/interfaces/order-item';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-customer-orders',
  imports: [
    OrderComponent,
    CommonModule
  ],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {
  customersService = inject(CustomersService)
  userService = inject(UserService);
  customerUuidService = inject(CustomerUuidService)

  user = this.userService.user;
  currentCustomer: Customer | undefined;
  userUuid: string = this.user()?.userUuid || ''

  formUserUuid = new FormGroup({
        uuid: new FormControl(''),
      });
  
    formCustomerUuid = new FormGroup({
      uuid: new FormControl(''),
    });

  orders:Order[] = []
  order: OrderItem[] = []

  ngOnInit(): void {
    const customerUuidForAdmin = this.customerUuidService.getCustomerUuid();
    if(customerUuidForAdmin) {
      this.fetchCustomerUuid(customerUuidForAdmin);
    } else {
      this.fetchCustomerByUserUuid();
    }
    // this.fetchOrders()
  }


  fetchCustomerByUserUuid(): void {
    this.customerUuidService.resetCustomerUuid();
    this.formUserUuid.patchValue({
      uuid: this.userUuid
    });

    const customerData = this.formUserUuid.value;
    this.customersService.getCustomerByUserUuid(customerData).subscribe({
      next: (response) => {
        console.log('Customer fetched successfully:', response);
        this.currentCustomer = response 
        console.log('Customer fetched successfully:', this.currentCustomer);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }

  fetchCustomerUuid(customerUuid: string): void {
    
    if (customerUuid) {
      this.formCustomerUuid.patchValue({
        uuid: customerUuid
      });
    }
    
    const customerData = this.formCustomerUuid.value;
    this.customersService.getCustomerByUuid(customerData).subscribe({
      next: (response) => {
        console.log('Customer fetched successfully:', response);
        this.currentCustomer = response 
        this.orders = this.currentCustomer.ordersReadOnlyDTOs
        console.log('Customer fetched successfully:', this.currentCustomer);
        
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }

 

}
