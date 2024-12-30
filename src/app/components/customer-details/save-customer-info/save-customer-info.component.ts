import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { CustomersService } from '../../../shared/services/customers.service';


@Component({
  selector: 'app-save-customer-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './save-customer-info.component.html',
  styleUrl: './save-customer-info.component.css'
})
export class SaveCustomerInfoComponent {
  router = inject(Router)
  userService = inject(UserService)
  customerService = inject(CustomersService)
  invalidLogin = false;
  

  user = this.userService.user
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userUuid: string = this.user()?.userUuid || '';
  

  form = new FormGroup({
    userUuid: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
  });

  onSubmit(customerInfo: any): void {
    if (this.form.valid) {  
      
      this.form.patchValue({
        firstname: customerInfo.firstname,
        lastname: customerInfo.lastname,
        userUuid: this.userUuid,
      });
      const customerData = this.form.value;
      console.log('CustomerInfo :', this.form);
      this.customerService.customerInfoSave(customerData).subscribe({
        next: (response) => {
          console.log('CustomeInfo saved successfully:', response);
          this.successMessage = 'CustomerInfo added successfully!';
          this.errorMessage = null;
          this.userService.logoutUser()
          

          const isConfirmed = window.confirm('CustomerInfo added successfully! You should loggin again?');
          if (isConfirmed) {
            this.router.navigate(['/login']);
          }
        },
        
        error: (err) => {
          console.error('Error saving customerInfo:', err);
          this.errorMessage = 'Failed to add customerInfo. Please try again.';
          this.successMessage = null;
        },
      });
    } else {
      console.error('Form is invalid. Check the input fields.');
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
    
  }

  

}
