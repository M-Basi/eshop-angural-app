import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../shared/services/category.service';
import { BrandService } from '../../shared/services/brand.service';
import { Brand, Category } from '../../shared/interfaces/java-backend';
import { MenuProductCategory } from '../../shared/interfaces/menu-product- category';
import { FilterService } from '../../shared/services/filter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-group-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-group-menu.component.html',
  styleUrls: ['./list-group-menu.component.css']
})
export class ListGroupMenuComponent implements OnInit {
  router = inject(Router);
  filterService = inject(FilterService);
  brandService = inject(BrandService);
  categoryService = inject(CategoryService);

  brands: Brand[] = [];
  categories: Category[] = [];
  // menuCategory: MenuProductCategory[] = [];
  // menuBrand: MenuProductCategory[] = [];
  displayedCategories: Category[] = []
  displayedBrands: Brand[] =  []
  categoriesVisible = false;
  brandsVisible = false;

  ngOnInit(): void {
    this.fetchBrands();
    this.fetchCategories();
  }

  fetchBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (response) => {
        this.brands = response || [];
        // this.updateMenuBrand();
        console.log('Brands fetched successfully:', this.brands);
        this.displayedBrands = this.brands.slice(0, 5);
      },
      error: (error) => {
        console.error('Error fetching brands:', error);
      }
    });
    
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response || [];
        // this.updateMenuCategory();
        console.log('Categories fetched successfully:', this.categories);
        this.displayedCategories = this.categories.slice(0, 5);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
    
  }

  onProductsClick(): void {
    this.filterService.resetFilters();
    this.router.navigate(['/product-List-All'], { queryParams: { } });
  }
  
  onCategoryClick(category: string): void {    
    this.filterService.resetFilters();
    this.filterService.setFilters({ category});
    this.router.navigate(['/product-List-All'], { queryParams: { category } });
    // category.isSelected = !category.isSelected;
    // if (category.isSelected) {
    //   this.filterService.resetFilters();
    //   this.filterService.setFilters({ category: category.categoryName});
    //   this.router.navigate(['/product-List-All'], { queryParams: { category: category.categoryName } });
    // } else {
    //   this.filterService.resetFilters();
    //   this.router.navigate(['/product-List-All']);
    // }
    
  }
  
  onBrandClick(brandName: string): void {
    this.filterService.resetFilters();
    this.filterService.setFilters({ brand: brandName });
    this.router.navigate(['/product-List-All'], { queryParams: { brand: brandName } });
  }


  toggleCategories(): void {
    this.categoriesVisible = !this.categoriesVisible;
    if (this.categoriesVisible) {
      this.brandsVisible = false; // Κλείνει τα brands
    }
  }

  showLessBrands(){
    this.displayedBrands = this.brands.slice(0, 5);
  }

  showLessCategories(){
    this.displayedCategories = this.categories.slice(0, 5);
  }
  

  toggleBrands(): void {
    this.brandsVisible = !this.brandsVisible;
    if (this.brandsVisible) {
      this.categoriesVisible = false; // Κλείνει τις κατηγορίες
    }
  }

  showMoreCategories(): void {
    this.displayedCategories = this.categories;
  }

  showMoreBrands(): void {
    this.displayedBrands = this.brands;
  }

 
  
}



