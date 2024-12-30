import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { map } from 'rxjs';
import { PaginatedResponse } from '../interfaces/java-backend';
import { FilterService } from './filter.service';
import { CustomerFilters } from '../interfaces/java-backend';
import { Customer } from '../interfaces/customer';
import { Order } from '../interfaces/order';

const API_URL = `${environment.apiURL}/api`;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  http: HttpClient = inject(HttpClient);

  filters: any= {}

  getCustomersFiltered(filters: CustomerFilters): Observable<PaginatedResponse<any>> {
      console.log('Filters being sent:', filters);
      return this.http.post<PaginatedResponse<any>>(`${API_URL}/customers/allPaginated`, filters
      
    )
  }

  getCustomerByUserUuid(userUuid: any): Observable<Customer> {
    return this.http.post<Customer>(`${API_URL}/customers/customer/userUuid`, userUuid);
    
  }

  getCustomerByUuid(uuid: any): Observable<Customer> {
    return this.http.post<Customer>(`${API_URL}/customers/customer/customer`, uuid);
    
  }

  customerInfoSave(customer: any): Observable<any> { //
      return this.http.post<any>(`${API_URL}/customers/customer/save`, customer); //
    }

  paymentInfoSave(paymentInfo: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/paymentInfo/save`, paymentInfo);
  }

  // getpaymentInfo(customerUuid: any): Observable<any> {
  //   return this.http.post<any>(`${API_URL}/paymentInfo/getByCustomer`, customerUuid);
  // }

  paymentInfoUpdate(paymentInfo: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/paymentInfo/update`, paymentInfo);
  }

  customerPersonalInfoSave(customerInfo: any): Observable<any>{
    return this.http.post<any>(`${API_URL}/customerInfo/save`, customerInfo);
  }

  customerPersonalInfoUpdate(customerInfo: any): Observable<any>{
    return this.http.post<any>(`${API_URL}/customerInfo/update`, customerInfo);
  }


  orderSave(order: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/orders/save`, order);
  } 

  getOrders(uuid: any): Observable<Order[]> {
    return this.http.post<Order[]>(`${API_URL}/orders/all`, uuid);
    
  }


}
