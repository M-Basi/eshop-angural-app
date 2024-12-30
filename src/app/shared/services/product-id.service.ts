import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductIdService {
  private productId: number | null = null;

  setProductId(id: any): void {
    localStorage.setItem('productId', id);
    this.productId = id
  }

  getProductId(): any {
    const id = localStorage.getItem('productId')
    if (id) {
      return parseInt(id)
    }
  }

  resetProductId(): void {
    this.productId = null;
    localStorage.removeItem('productId')
  }
}
