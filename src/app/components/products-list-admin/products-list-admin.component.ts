import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { ProductService } from '../../shared/services/product.service';
import { FilterService } from '../../shared/services/filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { ProductFilters } from '../../shared/interfaces/java-backend';
import { ProductIdService } from '../../shared/services/product-id.service';
import { CommonModule } from '@angular/common';
import { ProductSearchFiltersComponent } from './product-search-filters/product-search-filters.component';
import { CartService } from '../../shared/services/cart.service';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-products-list-admin',
  imports: [
    CommonModule, 
    ProductSearchFiltersComponent,
    ProductListComponent
  ],
  templateUrl: './products-list-admin.component.html',
  styleUrls: ['./products-list-admin.component.css'],
})
export class ProductsListAdminComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  // productIdService = inject(ProductIdService);
  // userService = inject(UserService);
  filterService = inject(FilterService);
  // cartService = inject(CartService)

  // user = this.userService.user;
  products: Product[] = [];
  filters: ProductFilters = {};
  totalPages = 0;
  totalPagesArray: number[] = [];
  totalElements = 0;
  currentPage = 1; // 1-based indexing for easier UX
  pageSize = 10;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
    this.filters = this.filterService.getFilters();

      // Ενημέρωση φίλτρων από queryParams
      this.filters = {
        ...this.filters,
        name: params['name'] || null,
        category: params['category'] || null,
        brand: params['brand'] || null,
        sku: params['sku'] || null,
      };

      this.currentPage = params['page'] ? +params['page'] : 1; // Χρήση σελίδας από queryParams
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const paginationParams = {
      ...this.filters,
      page: this.currentPage - 1, // Backend expects 0-based page indexing
      size: this.pageSize,
    };

    this.productService.getProductsFiltered(paginationParams).subscribe({
      next: (response) => {
        console.log('Products fetched successfully:', response);
        this.products = response.data || [];
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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
    this.fetchProducts();
  }


  

  onFiltersChanged(newFilters: ProductFilters): void {
    this.filters = newFilters;
    this.currentPage = 1; // Επαναφορά στην πρώτη σελίδα όταν αλλάζουν τα φίλτρα
    this.router.navigate([], {
      queryParams: { page: 1 },
      queryParamsHandling: 'merge',
    });
    this.fetchProducts();
  }
}

