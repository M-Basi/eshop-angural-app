import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { ProductIdService } from '../../shared/services/product-id.service';
import { Product } from '../../shared/interfaces/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-product-full-page',
  imports: [CommonModule],
  templateUrl: './product-full-page.component.html',
  styleUrls: ['./product-full-page.component.css'],
})
export class ProductFullPageComponent implements OnInit {
  cartService = inject(CartService)
  productService = inject(ProductService);
  productIdService = inject(ProductIdService);

  currentProduct: Product | null = null;

  ngOnInit(): void {
    const productId = this.productIdService.getProductId();
    if (productId) {
      this.fetchProductById(productId);
    } else {
      console.error('No productId found in ProductIdService.');
    }
  }

  fetchProductById(productId: number): void {
    this.productService.productById(productId).subscribe({
      next: (product) => {
        console.log('Product fetched successfully:', product);
        this.currentProduct = product;
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }

  addToCart(){
    this.cartService.addToCart(this.currentProduct);
    alert('Product added to cart!');
  }


}
