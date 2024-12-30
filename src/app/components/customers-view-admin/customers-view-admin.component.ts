import { Component, inject } from '@angular/core';
import { Customer } from '../../shared/interfaces/customer';
import { CustomerFilters } from '../../shared/interfaces/java-backend';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../shared/services/filter.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { CustomersService } from '../../shared/services/customers.service';
import { CommonModule } from '@angular/common';
import { empty } from 'rxjs';
import { CustomerUuidService } from '../../shared/services/customer-uuid.service';
import { CustomersFiltersComponent } from './customers-filters/customers-filters.component';


@Component({
  selector: 'app-customers-view-admin',
  imports: [
    CommonModule,
    CustomersFiltersComponent
  ],
  templateUrl: './customers-view-admin.component.html',
  styleUrl: './customers-view-admin.component.css'
})
export class CustomersViewAdminComponent {
  router = inject(Router);
  route = inject(ActivatedRoute)
  filterService = inject(FilterService);
  customerService = inject(CustomersService);
  customerUuidService = inject(CustomerUuidService)
  
  
  customersTotalOrders: number = 0
  customers: Customer[] = [];
  filters: CustomerFilters = {}; // Αρχικοποιούμε κενά φίλτρα
  totalPages = 0;
  totalElements = 0;
  numberOfElements = 0;
  currentPage = 1;
  pageSize = 10; 
  totalPagesArray: number[] = [];



  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filters = this.filterService.getCustomersFilters();

      // Ενημέρωση φίλτρων από queryParams
      this.filters = {
        ...this.filters,
        username: params['username'] || null,
        phoneNumber: params['phoneNumber'] || null,
        lastname: params['lastname'] || null,
      };
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.fetchCustomers();
    });
  }

  fetchCustomers(): void {
    const paginationParams = {
      ...this.filters,
      page: this.currentPage - 1, // Backend expects 0-based page indexing
      size: this.pageSize,
    };

    this.filters = this.filterService.getCustomersFilters(); // Ενημέρωση φίλτρων από το Service
    console.log('Filters being sent to API:', this.filters); // Έλεγχος στο console
  
    this.customerService.getCustomersFiltered(paginationParams).subscribe({
      next: (response) => {
        console.log('Customers fetched successfully:', response);
  
        this.customers = (response.data || []);
        // .map((customer: any) => ({
        //   ...customer
        // }));
  
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.updatePaginationArray();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  updatePaginationArray(): void {
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  



  onCustomerClick(uuid: string): void {
    this.customerUuidService.resetCustomerUuid();
    this.customerUuidService.setCustomerUuid(uuid);
    this.router.navigate(['/customer-details']);
  }

  toCheckOrders(uuid: string): void {
    this.customerUuidService.resetCustomerUuid();
    this.customerUuidService.setCustomerUuid(uuid);
    this.router.navigate(['/customer-orders']);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
    this.fetchCustomers();
  }


  onFiltersChanged(newFilters: CustomerFilters): void {
      this.filters = newFilters;
      this.currentPage = 1; // Επαναφορά στην πρώτη σελίδα όταν αλλάζουν τα φίλτρα
      this.router.navigate([], {
        queryParams: { page: 1 },
        queryParamsHandling: 'merge',
      });
      this.fetchCustomers();
    }
  



 
}