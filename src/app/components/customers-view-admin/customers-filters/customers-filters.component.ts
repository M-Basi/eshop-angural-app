import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerFilters } from '../../../shared/interfaces/java-backend';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-customers-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './customers-filters.component.html',
  styleUrl: './customers-filters.component.css'
})
export class CustomersFiltersComponent {
  @Output() filtersChanged = new EventEmitter<CustomerFilters>();
  filterService = inject(FilterService);

  customerFiltersForm = new FormGroup({
    username: new FormControl('', [ Validators.pattern('^[0-9]*$')]),
    phoneNumber: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    lastname: new FormControl(''),
    
  });


  ngOnInit(): void {
    

    // Ενημέρωση φίλτρων σε πραγματικό χρόνο
    this.customerFiltersForm.valueChanges.subscribe((filters) => {
      this.filterService.setCustomerFilters(filters); 
      this.filtersChanged.emit(filters); 
      
    });
    this.customerFiltersForm.patchValue(this.filterService.getCustomersFilters());
  }

  resetFilters(): void {
    this.filterService.resetCustomerFilters; 
    this.customerFiltersForm.reset(); 
    this.filtersChanged.emit(this.filterService.getCustomersFilters()); 
  }

}
