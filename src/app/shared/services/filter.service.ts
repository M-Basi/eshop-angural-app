import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFilters, ProductFilters } from '../interfaces/java-backend';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  router = inject(Router)

  private filters: ProductFilters = {
    name: null,
    brand: null,
    category: null,
    isActive: null,
    isInStock: null,
    uuid: null,
    id: null,
    sku: null
  };

  

  getFilters(): ProductFilters {
    return this.filters; // Επιστροφή των φίλτρων
  }

  setFilters(newFilters: Partial<ProductFilters>): void {
    this.filters = { ...this.filters, ...newFilters }; // Συγχώνευση νέων φίλτρων
    console.log('Updated Filters:', this.filters); // Έλεγχος στο console
  }

  resetFilters(): void {
    this.filters = {
      name: null,
      brand: null,
      category: null,
      isActive: null,
      isInStock: null,
      uuid: null,
      id: null,
      sku: null
    };
    console.log('Filters Reset:', this.filters); // Έλεγχος στο console
  }

  applyFilters(filters: Partial<ProductFilters>): void {
    this.setFilters(filters); // Χρήση της setFilters
    this.router.navigate(['/product-List-All']); // Πλοήγηση στο route
  }


  private customersFilters: CustomerFilters = {
    username: null, // Allows null
    phoneNumber: null,
    lastname: null,
    active: null,
    orderId: null,
    uuid: null,
    id: null,
  };



  getCustomersFilters(): CustomerFilters {
    return this.customersFilters; // Επιστροφή των φίλτρων
  }

  setCustomerFilters(newFilters: Partial<CustomerFilters>): void {
    this.customersFilters = { ...this.customersFilters, ...newFilters }; // Συγχώνευση νέων φίλτρων
    console.log('Updated CustomerFilters:', this.customersFilters); // Έλεγχος στο console
  }

  resetCustomerFilters(): void {
    this.customersFilters = {
      username: null, // Allows null
      phoneNumber: null,
      lastname: null,
      active: null,
      orderId: null,
      uuid: null,
      id: null,
    };
    console.log('Filters Reset:', this.customersFilters); // Έλεγχος στο console
  }

  applyCustomerFilters(customerfilters: Partial<CustomerFilters>): void {
    this.setCustomerFilters(customerfilters); // Χρήση της setFilters
    this.router.navigate(['/customer-List-All']); // Πλοήγηση στο route
  }

}


