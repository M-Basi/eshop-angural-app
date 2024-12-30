import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {of, Observable } from 'rxjs';



import { Brand } from '../interfaces/java-backend';


const API_URL = `${environment.apiURL}/api/brands`;

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  http: HttpClient = inject(HttpClient);

  private brands: Brand[] = []; 

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${API_URL}`)     
  }


  

}


