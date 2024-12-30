import { Component, inject } from '@angular/core';
import { FilterService } from '../../shared/services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  filterService = inject(FilterService)
  router = inject(Router)

  


  onProductsClick(): void {
    this.filterService.resetFilters();
    this.router.navigate(['/product-List-All']);
  }

  onContact(): void {
    this.router.navigate(['/contact - site']);
  }
  
}
