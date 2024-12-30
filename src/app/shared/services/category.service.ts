import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

import { map } from 'rxjs';

import { Brand, Category } from '../interfaces/java-backend';


const API_URL = `${environment.apiURL}/api/categories`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  http: HttpClient = inject(HttpClient);

  

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}`)     

  }
}


