import { Injectable } from '@angular/core';
import { OrderItem } from '../interfaces/order-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'cart';
  orderItem: OrderItem | undefined


  constructor() { }

  getCartItems(): OrderItem[] {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: any): void {
    const cart = this.getCartItems();
    const orderItem: OrderItem = {
      id: null,
      name: '',
      brand: null,
      sku: '',
      price: null,
      category: null,
      quantity: null,
      image: {
              filename: '',
              savedName: '',
              filePath: '',
              contentType: '',
              extension: '',
          },
      totalPrice: null,
    }
    if (product) {
      orderItem.id = product.id;
      orderItem.name = product.name;
      orderItem.sku = product.sku;
      orderItem.brand = product.brand;
      orderItem.category = product.category;
      orderItem.price = product.price;
      orderItem.quantity = 1;
      orderItem.image.filename = product.image.filename
      orderItem.image.contentType= product.image.contentType
      orderItem.image.extension = product.image.extension;
      orderItem.image.filePath = product.image.filePath;
      orderItem.image.savedName = product.image.savedName;
      orderItem.totalPrice = product.price * 1;
    }    
    if (orderItem) {
      const existingItem = cart.find(item => item.id === orderItem.id); // Εύρεση του στοιχείου με βάση κάποιο ID
      
      if (existingItem?.quantity) {
        // Αν δεν υπάρχει, το προσθέτουμε στο cart
        existingItem.quantity += 1;
      } else {
        // Αν υπάρχει, αυξάνουμε την ποσότητα του
        cart.push(orderItem);
      }
      
      this.saveCart(cart); // Αποθηκεύουμε το cart
    }
      
   
  }

    // Αφαίρεση προϊόντος από το καλάθι
    removeFromCart(productId : number): void {
      let cart = this.getCartItems();
      cart = cart.filter((item) => item.id !== productId);
      this.saveCart(cart);
    }

    updateItemQuantityCart(productId: number, quantity: number): void {
      const cart = this.getCartItems();
      const product = cart.find((item) => item.id === productId);

      if (product) {
        product.quantity = quantity > 0 ? quantity : 1;
        if (product.price) {
          product.totalPrice = quantity > 0 ? quantity * product.price : 0;
        }        
        this.saveCart(cart);
      }
    }
  
    // Εκκαθάριση του καλαθιού
    clearCart(): void {
      localStorage.removeItem(this.storageKey);
    }
  
    // Αποθήκευση καλαθιού στο localStorage
    private saveCart(cart: OrderItem[]): void {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    }
}
