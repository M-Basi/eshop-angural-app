import { Component, Input } from '@angular/core';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderItem } from '../../shared/interfaces/order-item';
import { Order } from '../../shared/interfaces/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [
    CommonModule,
    OrderItemComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  @Input() order: Order | undefined
  

  


}
