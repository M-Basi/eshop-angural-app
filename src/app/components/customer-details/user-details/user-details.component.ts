import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { CustomerUuidService } from '../../../shared/services/customer-uuid.service';
import { CustomersService } from '../../../shared/services/customers.service';
import { Customer } from '../../../shared/interfaces/customer';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  userService = inject(UserService)
  customerSevice = inject(CustomersService)
  customerUuidService = inject(CustomerUuidService)
  currentCustomer: Customer | undefined;
  username: string | undefined

  user = this.userService.user

  formCustomerUuid = new FormGroup({
      uuid: new FormControl(''),
    });

  ngOnInit(): void {    
    this.fetchCustomerUuid();
    if (this.currentCustomer) {
      this.username = this.currentCustomer.userReadOnlyDTO.username
    } else {
      this.username = this.user()?.username
    }
    
  }

    
  fetchCustomerUuid(): void {
    const customerUuid = this.customerUuidService.getCustomerUuid();

    this.formCustomerUuid.patchValue({
      uuid: customerUuid
    });
  
    
    const customerData = this.formCustomerUuid.value;
    this.customerSevice.getCustomerByUuid(customerData).subscribe({
      next: (response) => {
        console.log('Customer fetched successfully:', response);
        this.currentCustomer = response 
        console.log('Customer fetched successfully:', this.currentCustomer);
        this.username = this.currentCustomer?.userReadOnlyDTO.username
        
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }

}
