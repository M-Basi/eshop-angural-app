import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { CustomersService } from '../../../shared/services/customers.service';
import { Customer } from '../../../shared/interfaces/customer';

@Component({
  selector: 'app-save-payment-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './save-payment-info.component.html',
  styleUrl: './save-payment-info.component.css'
})
export class SavePaymentInfoComponent {
  router = inject(Router)
  userService = inject(UserService)
  customerService = inject(CustomersService)
  invalidLogin = false;
  currentCustomer: Customer | undefined;
  

  user = this.userService.user
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userUuid: string = this.user()?.userUuid || '';
  

  form = new FormGroup({
    customerUuid: new FormControl(''), // No validation needed here
  card: new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d{16}$'), // Corrected pattern for 16 digits
  ]),
  cardName: new FormControl('', Validators.required), // Cardholder name is required
  expiredDate: new FormControl('', [
    Validators.required,
    Validators.pattern('^(0[1-9]|1[0-2])/\\d{2}$'), // MM/YY format validation
  ]),
  cardValidation: new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d{3}$'), // Corrected pattern for 3 digits (CVV)
  ]),
  });

  formCustomerUuid = new FormGroup({
    uuid: new FormControl(''),
  });
  

  ngOnInit(): void {
    this.fetchCustomerByUserUuid()
    
  }

  onSubmit(paymentInfo: any): void {
    if (this.form.valid) {  
      
      this.form.patchValue({
        card: paymentInfo.card,
        cardName: paymentInfo.cardName,
        expiredDate: paymentInfo.expiredDate,
        cardValidation: paymentInfo.cardValidation,
        customerUuid: this.currentCustomer?.uuid,
      });
      const customerData = this.form.value;
      console.log('PaymentInfo :', this.form);
      this.customerService.paymentInfoSave(customerData).subscribe({
        next: (response) => {
          console.log('PaymentInfo saved successfully:', response);
          this.successMessage = 'PaymentInfo added successfully!';
          this.errorMessage = null;          

          const isConfirmed = window.confirm('PaymentInfo added successfully! You should go to your personal Details?');
          if (isConfirmed) {
            this.router.navigate(['/customer-details']);
          }
        },
        
        error: (err) => {
          console.error('Error saving paymentInfo:', err);
          this.errorMessage = 'Failed to add paymentInfo. Please try again.';
          this.successMessage = null;
        },
      });
    } else {
      console.error('Form is invalid. Check the input fields.');
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
    
  }

  fetchCustomerByUserUuid(): void {
    this.formCustomerUuid.patchValue({
      uuid: this.userUuid
    });

    const customerData = this.formCustomerUuid.value;
    this.customerService.getCustomerByUserUuid(customerData).subscribe({
      next: (response) => {
        console.log('Customer fetched successfully:', response);
        this.currentCustomer = response 
        console.log('Customer fetched successfully:', this.currentCustomer);
      },
      error: (error) => {
        console.error('Error fetching customer:', error);
      },
    });
  }

  

}
