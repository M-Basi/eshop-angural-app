import { Component, inject, Input } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from '../../shared/services/product.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '../../shared/interfaces/java-backend';
import { Category } from '../../shared/interfaces/java-backend';
import { BrandService } from '../../shared/services/brand.service';
import { CategoryService } from '../../shared/services/category.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';





@Component({
  selector: 'app-add-product',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule,

  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  router = inject(Router)
  brandService = inject(BrandService)
  categoryService = inject(CategoryService)


  brands: Brand[] = [];
  categories: Category[] = [];
  productService = inject(ProductService)
  products: Product[] =[];
  isSkuExisting: boolean = false;
  skuValue: string = '';
  filteredBrands: Brand[] = [];
  filteredCategories: Category[] =[];


  
  ngOnInit(): void {
    this.checkforSku()
    this.fetchBrands()
    this.fetchCategories()
    
  }

  checkforSku(): void {
    this.productService.getListProducts().subscribe({
      next: (response) => {
        // Μετατροπή του response σε this.products
        this.products = (response || []).map((product: any) => ({
          ...product
        }));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }


  successMessage: string | null = null;
  errorMessage: string | null = null;
  errorMessageSku: string | null = null;
  filePreview: string | ArrayBuffer | null = null;

  productForm = new FormGroup({
    sku: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    brandName: new FormControl("", [
      Validators.required,
      // Validators.pattern('^[0-9]*$'),
      // Validators.min(1),
      // Validators.max(50),
    ]),
    categoryName: new FormControl("", [
      Validators.required,
      // Validators.pattern('^[0-9]*$'),
      // Validators.min(1),
      // Validators.max(19),
    ]),
    quantity: new FormControl("", [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.min(0)
    ]),
    description: new FormControl('', Validators.required),
  });


  photoProductForm = new FormGroup({
    photoProduct: new FormControl<File | null>(null, Validators.required)
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoProductForm.get('photoProduct')?.setValue(file);
  
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  

  onSubmit(productData: any, photo: any): void {
    if (this.productForm.valid && this.photoProductForm.valid) {
      const formData = new FormData();
  
      // Δημιουργία του αντικειμένου προϊόντος
      const product = {
        sku: productData.sku.trim(),
        name: productData.name.trim(),
        price: parseFloat(productData.price), // Double
        brandName: productData.brandName, 
        categoryName: productData.categoryName, 
        quantity: parseInt(productData.quantity, 10), // Integer
        description: productData.description,
      };
  
      // Προσθήκη δεδομένων προϊόντος ως JSON string
      formData.append('product', JSON.stringify(product));
  
      // Προσθήκη εικόνας
      const photoFile = photo.photoProduct;
      if (photoFile instanceof File) {
        formData.append('photoProduct', photoFile);
      } else {
        console.error('Invalid file type:', photoFile);
        this.errorMessage = 'Invalid file type. Please upload a valid image.';
        return;
      }
      console.log('Form Data Entries:', Array.from(formData.entries()));
      // Αποστολή μέσω του Service
      this.productService.saveProduct(formData).subscribe({
        next: (response) => {
          console.log('Product saved successfully:', response);
          this.successMessage = 'Product added successfully!';
          this.errorMessage = null;
          const isConfirmed = window.confirm('Product added successfully! Do you want to go back to the product list?');
          if (isConfirmed) {
            this.router.navigate(['/product-List-All']);
          }
        },
        
        error: (err) => {
          console.error('Error saving product:', err);
          this.errorMessage = 'Failed to add product. Please try again.';
          this.successMessage = null;
        },
      });
    } else {
      console.error('Form is invalid. Check the input fields.');
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
    this.productForm.reset();
    
  }
  
  


  onSkuInput(event: Event): void {
    
    this.skuValue = (event.target as HTMLInputElement).value;

    this.isSkuExisting = this.products.some(
          (product: any) => product.sku.trim() === this.skuValue
        );
  
        if (this.isSkuExisting) {
          // Ενημερώνουμε το μήνυμα σφάλματος
          this.errorMessageSku = `Product with SKU "${this.skuValue}" already exists in the database.`;
        } else {
          // Καθαρισμός μηνύματος σφάλματος αν το SKU δεν υπάρχει
          this.errorMessageSku = null;
        }
      
    }


    fetchBrands(): void {
      this.brandService.getBrands().subscribe({
        next: (response) => {
          this.brands = response || [];
          console.log('Brands fetched successfully:', this.brands);
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
          console.log('Categories fetched successfully:', this.categories);
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    }
  
    filterBrands(): void {
      const inputValue1 = this.productForm.get('brandName')?.value?.toString().toLowerCase() || '';
      this.filteredBrands = this.brands.filter(brand =>
        brand.brandName.toLowerCase().includes(inputValue1) ||
        brand.id.toString().includes(inputValue1)
      );
    }

    filterCategories(): void {
      const inputValue2 = this.productForm.get('categoryName')?.value?.toString().toLowerCase() || '';
      this.filteredCategories = this.categories.filter(category =>
        category.categoryName.toLowerCase().includes(inputValue2) ||
        category.id.toString().includes(inputValue2)
      );
    }
    
    onBrandSelected(event: any): void {
      const selectedBrandName = event.option.value;
      this.productForm.get('brandName')?.setValue(selectedBrandName);
    }
    
    onCategorySelected(event: any): void {
      const selectedCategoryName = event.option.value;
      this.productForm.get('categoryName')?.setValue(selectedCategoryName);
    }



}

  


  // clearImage(): void {
  //   this.filePreview = null; // Καθαρισμός προεπισκόπησης
  //   this.photoProductForm.reset(); // Καθαρισμός του FormControl για την εικόνα
  // }

  
  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     this.photoProductForm.patchValue({ photoProduct: file });

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.filePreview = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


