import { Component, inject, Input } from '@angular/core';
import { Customer } from '../../../shared/interfaces/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-personal-info',
  imports: [],
  templateUrl: './customer-personal-info.component.html',
  styleUrl: './customer-personal-info.component.css'
})
export class CustomerPersonalInfoComponent {
  @Input() customer: Customer | undefined
  router = inject(Router)
    
  onEditClick(){
    this.router.navigate(['/customer - Personal - Info - update']);
    
  }

  onSaveClick(){
    this.router.navigate(['/customerPersonalInfo - save']);
  }
}
