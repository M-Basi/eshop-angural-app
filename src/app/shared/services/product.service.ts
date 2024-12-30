import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { map } from 'rxjs';
import { ProductFilters } from '../interfaces/java-backend';
import { PaginatedResponse } from '../interfaces/java-backend';
import { FilterService } from './filter.service';


const API_URL = `${environment.apiURL}/api`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http: HttpClient = inject(HttpClient);
  
  filters: any= {}

  getListProducts(): Observable<any> {
    return this.http.get<any>(`${API_URL}/products/list`)
      
  }


  getProducts(): Observable<any> {
    return this.http.get<any>(`${API_URL}/products/pageable`)
    // return this.http.post<any>(`${API_URL}/all`, filters)   
  }

  getProductsFiltered(filters: ProductFilters): Observable<PaginatedResponse<any>> {
    console.log('Filters being sent:', filters);
    return this.http.post<PaginatedResponse<any>>(`${API_URL}/products/all`, filters
    // {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }
  )
  }

  deleteProduct(productId: number): Observable<Product> {
    return this.http.post<Product>(`${API_URL}/product/delete`, productId)
  }

  productById(productId: number): Observable<Product> {
    // if (!productId) {
    //   throw new Error('Invalid productId: Cannot fetch product without a valid ID');
    // }
    return this.http.post<Product>(`${API_URL}/products/product`, productId)
  }


  saveProduct(formData: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/product/save`, formData)
  }

  updateProduct(formData: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/product/update`, formData)
  }
}

