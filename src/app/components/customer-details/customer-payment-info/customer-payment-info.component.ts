import { Component, Input, inject } from '@angular/core';
import { Customer } from '../../../shared/interfaces/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-payment-info',
  imports: [],
  templateUrl: './customer-payment-info.component.html',
  styleUrl: './customer-payment-info.component.css'
})
export class CustomerPaymentInfoComponent {
   @Input() customer: Customer | undefined
   router = inject(Router)
    
    onEditClick(){
      this.router.navigate(['/paymentInfo - update']);
      
    }
  
    onSaveClick(){
      this.router.navigate(['/paymentInfo - save']);
     
    }
}
