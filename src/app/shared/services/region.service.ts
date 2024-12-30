import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Region } from '../interfaces/region';


const API_URL = `${environment.apiURL}/api/regions`;

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  http: HttpClient = inject(HttpClient);

  private Regions: Region[] = []; 

  getRegions(): Observable<Region[]> {
      return this.http.get<Region[]>(`${API_URL}`)     
  
    }
}
