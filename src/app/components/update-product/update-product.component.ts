import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';
import { Router } from '@angular/router';
import { Brand } from '../../shared/interfaces/java-backend';
import { Category } from '../../shared/interfaces/java-backend';
import { BrandService } from '../../shared/services/brand.service';
import { CategoryService } from '../../shared/services/category.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductIdService } from '../../shared/services/product-id.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/interfaces/java-backend';

@Component({
  selector: 'app-update-product',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatAutocompleteModule
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
    router = inject(Router)
    brandService = inject(BrandService)
    categoryService = inject(CategoryService)
    productService = inject(ProductService)
    productIdService = inject(ProductIdService)
    userService = inject(UserService);

    user = this.userService.user;

    brands: Brand[] = [];
    categories: Category[] = [];
    
    products: Product[] =[];
    isSkuExisting: boolean = false;
    skuValue: string = '';
    filteredBrands: Brand[] = [];
    filteredCategories: Category[] =[];
  

    currentProduct: Product | undefined
    
  
    
    ngOnInit(): void {

      const productId = this.productIdService.getProductId();
      if (productId) {
        this.fetchProductById(productId);
      } else {
        console.error('No productId found in ProductIdService.');
      }
      this.fetchBrands()
      this.fetchCategories()
      
      
      
    }

    fetchProductById(productId: number): void {
      this.productService.productById(productId).subscribe({
        next: (product) => {
          console.log('Product fetched successfully:', product);
          this.currentProduct = product;
          this.onProduct();
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        },
        
      });
    }

    onProduct() : void{
      if (this.currentProduct) {
        this.productForm.get('sku')?.setValue(this.currentProduct.sku)
        this.productForm.get('brandName')?.setValue(this.currentProduct.brand.brandName);
        this.productForm.get('categoryName')?.setValue(this.currentProduct.category.categoryName);
        this.productForm.get('price')?.setValue(this.currentProduct.price.toString());
        this.productForm.get('name')?.setValue(this.currentProduct.name);
        this.productForm.get('quantity')?.setValue(this.currentProduct.quantity.toString());
        this.productForm.get('description')?.setValue(this.currentProduct.description);

        if (this.currentProduct.image) {
          this.filePreview = this.currentProduct.image.filePath;
        }
      }
    }
  
    
  
  
    successMessage: string | null = null;
    errorMessage: string | null = null;
    errorMessageSku: string | null = null;
    filePreview: string | ArrayBuffer | null = null;
  
    productForm = new FormGroup({
      id: new FormControl(),
      uuid: new FormControl(),
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
      if (this.currentProduct?.image?.filePath) {
        this.filePreview = this.currentProduct.image.filePath;
      }

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
  
    
  
    onUpdate(productData: any, photo: any): void {
      if (this.productForm.valid && this.photoProductForm.valid) {
        const formData = new FormData();
        
        // Δημιουργία του αντικειμένου προϊόντος
        const product = {
          id: this.currentProduct?.id,
          uuid: this.currentProduct?.uuid,
          sku: productData.sku,
          name: productData.name,
          price: parseFloat(productData.price), // Double
          brandName: productData.brandName, 
          categoryName: productData.categoryName, 
          quantity: parseInt(productData.quantity, 10), // Integer
          description: productData.description,
        };
        const productId = this.currentProduct?.id
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
        this.productService.updateProduct(formData).subscribe({
          next: (response) => {
            console.log('Product updated successfully:', response);
            this.successMessage = 'Product updated successfully!';
            this.errorMessage = null;
            const isConfirmed = window.confirm('Product updated successfully! Do you want to go to check the full product?');
            if (isConfirmed) {
              this.productIdService.resetProductId();              
              this.productIdService.setProductId(productId);
              this.router.navigate(['/product-Full-View']);
              
            }
          },
          
          error: (err) => {
            console.error('Error updated product:', err);
            this.errorMessage = 'Failed to update product. Please try again.';
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


