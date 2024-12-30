import { Component, inject, OnInit, Input } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { ProductIdService } from '../../shared/services/product-id.service';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  productIdService = inject(ProductIdService)
  router = inject(Router)
  cartService = inject(CartService)
  userService = inject(UserService)
  productService = inject(ProductService)


  user = this.userService.user;

  @Input() product: Product | undefined



  onProductClick(productId: number): void {
    this.productIdService.resetProductId();
    this.productIdService.setProductId(productId);
    this.router.navigate(['/product-Full-View']);
  }

  toUpdateProduct(productId: number): void {
    this.productIdService.resetProductId();
    this.productIdService.setProductId(productId);
    this.router.navigate(['/product-Update']);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert('Product added to cart!');
  }

  deleteProduct(productId: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this product?');
    if (!isConfirmed) return;

    this.productService.deleteProduct(productId).subscribe({
      next: (response) => {
        this.router.navigate(['/product-List-All'])
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      },
    });
  }
  


}