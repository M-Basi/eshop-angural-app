import { Component, inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { OrderItem } from '../../shared/interfaces/order-item';
import { CommonModule } from '@angular/common';
import { ProductIdService } from '../../shared/services/product-id.service';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CustomerUuidService } from '../../shared/services/customer-uuid.service';
import { CustomersService } from '../../shared/services/customers.service';
import { Customer } from '../../shared/interfaces/customer';



@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService)
  productIdService = inject(ProductIdService)
  router = inject(Router)
  customerUuidService = inject(CustomerUuidService)
  customerService = inject(CustomersService)
  successMessage: string | null = null;
  errorMessage: string | null = null;
  
  

  currentCustomer: Customer | undefined;
  totalSum: number = 0;
  cartItems: OrderItem[] = []

  form = new FormGroup({
    customerUuid: new FormControl(),
    orderItems: new FormArray([])
  })

  formUserUuid = new FormGroup({
    uuid: new FormControl(''),
  });
    
  ngOnInit(): void {
    this.fetchCustomerUuid();

    this.loadCart();
   
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal()
  }



  // Αφαίρεση προϊόντος
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  // Εκκαθάριση καλαθιού
  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  onProductClick(productId: number): void {
    this.productIdService.resetProductId();
    this.productIdService.setProductId(productId);
    this.router.navigate(['/product-Full-View']);
  }

  updateQuantity(productId: number, quantity: number): void {
  
    if (quantity < 1) {
      quantity = 1;
    }
    this.cartService.updateItemQuantityCart(productId, quantity);
    this.loadCart();
  }

  calculateTotal(): void {
    this.totalSum = this.cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const price = item.price || 0; 
      return sum + quantity * price;
    }, 0);
  }

  patchForm(): void {
    if(this.currentCustomer) {
      this.form.get('customerUuid')?.setValue(this.currentCustomer.uuid);
    }    
    const orderItems = this.form.get('orderItems') as FormArray;
    orderItems.clear(); // Καθαρισμός προηγούμενων δεδομένων

    this.cartItems.forEach((item) => {
      orderItems.push(
        new FormGroup({
          sku: new FormControl(item.sku),
          quantity: new FormControl(item.quantity),
        })
      );
    });

    console.log('Form patched with cart items:', this.form.value);
  }


  placeOrder(){
    this.patchForm();
    const formData = this.form.value;
    this.customerService.orderSave(formData).subscribe({
        next: (response) => {
          console.log('Order saved successfully:', response);
          this.successMessage = 'Η παραγγελία τοποθετήθηκε με επιτυχία';
          this.errorMessage = null;          

          const isConfirmed = window.confirm('Η παραγγελία τοποθετήθηκε με επιτυχία!');
          if (isConfirmed) {
            this.router.navigate(['/welcome']);
          }
        },
        
        error: (err) => {
          console.error('Error saving order:', err);
          this.errorMessage = 'Failed to save order. Please try again.';
          this.successMessage = null;
        },
      });
    } 
  

  

  fetchCustomerUuid(): void {
    const userUuid = localStorage.getItem('userUuid');

    this.formUserUuid.patchValue({
      uuid: userUuid
    });
  
    
    const userData = this.formUserUuid.value;
    this.customerService.getCustomerByUserUuid(userData).subscribe({
      next: (response) => {
        console.log('Customer fetched successfully:', response);
        this.currentCustomer = response 
        console.log('Customer fetched successfully:', this.currentCustomer);
        
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

}