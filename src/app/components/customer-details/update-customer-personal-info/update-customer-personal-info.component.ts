import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { CustomersService } from '../../../shared/services/customers.service';
import { Customer } from '../../../shared/interfaces/customer';
import { RegionService } from '../../../shared/services/region.service';
import { Region } from '../../../shared/interfaces/region';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { CustomerInfo } from '../../../shared/interfaces/customer-info';

@Component({
  selector: 'app-update-customer-personal-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './update-customer-personal-info.component.html',
  styleUrl: './update-customer-personal-info.component.css'
})
export class UpdateCustomerPersonalInfoComponent {
router = inject(Router)
  userService = inject(UserService)
  customerService = inject(CustomersService)
  regionService = inject(RegionService)

  invalidLogin = false;
  currentCustomer: Customer | undefined;
  user = this.userService.user
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userUuid: string = this.user()?.userUuid || '';
  regions: Region[] = [];
  filteredRegions: Region[] =[];
  customerPersonalInfo: CustomerInfo | undefined;
  

  ngOnInit(): void {
    this.fetchCustomerByUserUuid()
    this.fetchRegions()
    
  }

  form = new FormGroup({
    id: new FormControl(),
    phoneNumber: new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d{10}$'), 
    ]),
    country: new FormControl('', Validators.required),
    region: new FormControl('',Validators.required,
    ),
    city: new FormControl('',Validators.required,),
    street: new FormControl('',Validators.required,),
    streetNumber: new FormControl('',Validators.required),
    zipCode: new FormControl('',[Validators.required,Validators.pattern('^\\d{5}$')]),
  });

  formCustomerUuid = new FormGroup({
    uuid: new FormControl(''),
  });
  

  onUpdate(customerPersonalInfo: any): void {
    if (this.form.valid ) {  
      
      this.form.patchValue({
        id: this.customerPersonalInfo?.id,
        phoneNumber: customerPersonalInfo.phoneNumber,
        country: customerPersonalInfo.country,
        region: customerPersonalInfo.region,
        city: customerPersonalInfo.city,
        street: customerPersonalInfo.street,
        streetNumber: customerPersonalInfo.streetNumber,
        zipCode: customerPersonalInfo.zipCode

        
      });
      const customerInfoData = this.form.value;
      console.log('CustomerPersonalInfo :', this.form);
      this.customerService.customerPersonalInfoUpdate(customerInfoData).subscribe({
        next: (response) => {
          console.log('CustomerPersonalInfo saved successfully:', response);
          this.successMessage = 'CustomerPersonalInfo added successfully!';
          this.errorMessage = null;          

          const isConfirmed = window.confirm('CustomerPersonalInfo added successfully! You should go to your personal Details?');
          if (isConfirmed) {
            this.router.navigate(['/customer-details']);
          }
        },
        
        error: (err) => {
          console.error('Error saving CustomerPersonalInfo:', err);
          this.errorMessage = 'Failed to add CustomerPersonalInfo. Please try again.';
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
        this.getCustomerPersonalInfo()
        this.onCustomerPersonalInfo()
      },
      error: (error) => {
        console.error('Error fetching customer:', error);
      },
    });
  }

  fetchRegions(): void {
    this.regionService.getRegions().subscribe({
      next: (response) => {
        this.regions = response || [];
        console.log('Regions fetched successfully:', this.regions);
      },
      error: (error) => {
        console.error('Error fetching regions:', error);
      }
    });
  }

  filterRegions(): void {
    const inputValue = this.form.get('region')?.value?.toString().toLowerCase() || '';
    this.filteredRegions = this.regions.filter(region =>
      region.name?.toLowerCase().includes(inputValue) ||
      region.id?.toString().includes(inputValue)
    );
  }

  onRegionSelected(event: any): void {
    const selectedRegionName = event.option.value;
    this.form.get('region')?.setValue(selectedRegionName);
  }

  onCustomerPersonalInfo() : void{
    if (this.customerPersonalInfo) {
      this.form.patchValue({
        phoneNumber: this.customerPersonalInfo.phoneNumber,
        country: this. customerPersonalInfo.country,
        region: this.customerPersonalInfo.region?.name,
        city: this.customerPersonalInfo.city,
        street: this.customerPersonalInfo.street,
        streetNumber: this.customerPersonalInfo.streetNumber,
        zipCode: this.customerPersonalInfo.zipCode
      });
    } else {
      console.error('Payment info is not available.');
    }
  }

  getCustomerPersonalInfo(){
    if (this.currentCustomer?.customerInfoReadOnlyDTO) {
      this.customerPersonalInfo = this.currentCustomer.customerInfoReadOnlyDTO
    }
  } 

  

}