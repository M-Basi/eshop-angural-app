import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrandService } from '../../../shared/services/brand.service';
import { CategoryService } from '../../../shared/services/category.service';
import { FilterService } from '../../../shared/services/filter.service';
import { Brand, Category, ProductFilters } from '../../../shared/interfaces/java-backend';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@Component({
  selector: 'app-product-search-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './product-search-filters.component.html',
  styleUrls: ['./product-search-filters.component.css'],
})
export class ProductSearchFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  filterService = inject(FilterService);
  brandService = inject(BrandService);
  categoryService = inject(CategoryService);

  brands: Brand[] = [];
  categories: Category[] = [];
  filteredBrands: Brand[] = [];
  filteredCategories: Category[] = [];

  productFiltersForm = new FormGroup({
    sku: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    name: new FormControl(''),
    brand: new FormControl(''),
    category: new FormControl(''),
  });

  ngOnInit(): void {
    this.fetchBrands();
    this.fetchCategories();

    // Ενημέρωση φίλτρων σε πραγματικό χρόνο
    this.productFiltersForm.valueChanges.subscribe((filters) => {
      this.filterService.setFilters(filters); // Ενημέρωση των φίλτρων στο service
      this.filtersChanged.emit(filters); // Εκπομπή φίλτρων στον γονέα component
      
    });

    // Αρχικοποίηση φόρμας με φίλτρα από το service
    this.productFiltersForm.patchValue(this.filterService.getFilters());
   
  }

  fetchBrands(): void {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response || [];
    });
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((response) => {
      this.categories = response || [];
    });
  }

  filterBrands(): void {
    const inputValue = this.productFiltersForm.get('brand')?.value?.toLowerCase() || '';
    this.filteredBrands = this.brands.filter((brand) =>
      brand.brandName.toLowerCase().includes(inputValue)
    );
  }

  filterCategories(): void {
    const inputValue = this.productFiltersForm.get('category')?.value?.toLowerCase() || '';
    this.filteredCategories = this.categories.filter((category) =>
      category.categoryName.toLowerCase().includes(inputValue)
    );
  }

  onBrandSelected(event: any): void {
    const selectedBrandName = event.option.value;
    this.productFiltersForm.get('brand')?.setValue(selectedBrandName);
  }
  
  onCategorySelected(event: any): void {
    const selectedCategoryName = event.option.value;
    this.productFiltersForm.get('category')?.setValue(selectedCategoryName);
  }

  resetFilters(): void {
    this.filterService.resetFilters(); // Επαναφορά φίλτρων στο service
    this.productFiltersForm.reset(); // Επαναφορά φόρμας
    this.filtersChanged.emit(this.filterService.getFilters()); // Ενημέρωση του γονέα για την επαναφορά
  }
}


