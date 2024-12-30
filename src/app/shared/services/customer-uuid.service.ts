import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerUuidService {

  private customerUuid: string | null = null;

  setCustomerUuid(customerUuid: any): void {
    this.customerUuid = customerUuid;
    localStorage.setItem('customerUuid', customerUuid);
  }

  getCustomerUuid(): any {
    const uuid = localStorage.getItem('customerUuid')
    if (uuid) {
      return uuid
    }
  }

  resetCustomerUuid(): void {
    this.customerUuid = null;
    localStorage.removeItem('customerUuid')
  }
}
