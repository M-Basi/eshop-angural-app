import { Component, inject, OnInit } from '@angular/core';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerPaymentInfoComponent } from './customer-payment-info/customer-payment-info.component';
import { CustomerPersonalInfoComponent } from './customer-personal-info/customer-personal-info.component';
import { Customer } from '../../shared/interfaces/customer';
import { CustomersService } from '../../shared/services/customers.service';
import { UserService } from '../../shared/services/user.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerUuidService } from '../../shared/services/customer-uuid.service';


@Component({
  selector: 'app-customer-details',
  imports: [
    CustomerInfoComponent,
    CustomerPaymentInfoComponent,
    CustomerPersonalInfoComponent,
    UserDetailsComponent

  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  userService = inject(UserService);
  customerSevice = inject(CustomersService)
  customerUuidService = inject(CustomerUuidService)

  // customerUuidForAdmin:string | undefined;


  user = this.userService.user;
  currentCustomer: Customer | undefined;
  userUuid: string = this.user()?.userUuid || ''

  formUserUuid = new FormGroup({
      uuid: new FormControl(''),
    });

  formCustomerUuid = new FormGroup({
    uuid: new FormControl(''),
  });

  

  ngOnInit(): void {
    const customerUuidForAdmin = this.customerUuidService.getCustomerUuid();
    if(customerUuidForAdmin) {
      this.fetchCustomerUuid(customerUuidForAdmin);
    } else {
      this.fetchCustomerByUserUuid();
    }



    // this,this.fetchCustomerByUserUuid()
    
  }



  fetchCustomerByUserUuid(): void {
    this.customerUuidService.resetCustomerUuid();
    this.formUserUuid.patchValue({
      uuid: this.userUuid
    });

    const customerData = this.formUserUuid.value;
    this.customerSevice.getCustomerByUserUuid(customerData).subscribe({
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
    this.customerSevice.getCustomerByUuid(customerData).subscribe({
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

}
