import { Component, Input, inject} from '@angular/core';
import { Customer } from '../../../shared/interfaces/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-info',
  imports: [],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css'
})
export class CustomerInfoComponent {
  @Input() customer: Customer | undefined
  router = inject(Router)
  
  onEditClick(){

  }

  onSaveClick(){
    this.router.navigate(['/customerInfo - save']);
    
  }

}
