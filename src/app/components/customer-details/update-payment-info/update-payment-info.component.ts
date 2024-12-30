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
import { PaymentInfo } from '../../../shared/interfaces/payment-info';

@Component({
  selector: 'app-update-payment-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './update-payment-info.component.html',
  styleUrl: './update-payment-info.component.css'
})
export class UpdatePaymentInfoComponent {
  router = inject(Router)
  userService = inject(UserService)
  customerService = inject(CustomersService)
  currentCustomer: Customer | undefined;
  paymentInfo: PaymentInfo | undefined;
  

  user = this.userService.user
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userUuid: string = this.user()?.userUuid || '';
  

  form = new FormGroup({
    uuid: new FormControl(),
    id: new FormControl(),
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

  formUserUuid = new FormGroup({
    uuid: new FormControl(''),
  });

 
  ngOnInit(): void {
    this.fetchCustomerByUserUuid()   
   
  }

  onUpdate(paymentInfoInput: any): void {
    if (this.form.valid && this.paymentInfo?.id) { 
      this.form.patchValue({
        card: paymentInfoInput.card,
        cardName: paymentInfoInput.cardName,
        cardValidation: paymentInfoInput.cardValidation,
        expiredDate: paymentInfoInput.expiredDate,
        id: this.paymentInfo.id,
        uuid: this.currentCustomer?.uuid
      });
      
      
      
      const paymentData = this.form.value;
      console.log('PaymentInfo :', paymentData);
      this.customerService.paymentInfoUpdate(paymentData).subscribe({
        next: (response) => {
          console.log('PaymentInfo updated successfully:', response);
          this.successMessage = 'PaymentInfo updated successfully!';
          this.errorMessage = null;          

          const isConfirmed = window.confirm('PaymentInfo updated successfully! You should go to your personal Details?');
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
    this.formUserUuid.patchValue({
      uuid: this.userUuid
    });

    const customerData = this.formUserUuid.value;
    this.customerService.getCustomerByUserUuid(customerData).subscribe({
      next: (response) => {
        this.currentCustomer = response 
        console.log('Customer fetched successfully:', this.currentCustomer);
        this.getPaymentInfo();
        this.onPaymentInfo();
        console.log('Form:', this.form);
      },
      error: (error) => {
        console.error('Error fetching customer:', error);
      },
    });
  }

  onPaymentInfo() : void{
    if (this.paymentInfo) {
      this.form.patchValue({
        card: this.paymentInfo.card,
        cardName: this.paymentInfo.cardName,
        cardValidation: this.paymentInfo.cardValidation,
        expiredDate: this.paymentInfo.expiredDate,
      });
    } else {
      console.error('Payment info is not available.');
    }
  }

  getPaymentInfo(){
    if (this.currentCustomer?.paymentInfoReadOnlyDTO) {
      this.paymentInfo = this.currentCustomer.paymentInfoReadOnlyDTO
    }
  } 

  

}


