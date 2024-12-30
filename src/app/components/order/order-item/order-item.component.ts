import { Component, Input } from '@angular/core';
import { OrderItem } from '../../../shared/interfaces/order-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [
    CommonModule
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.css'
})
export class OrderItemComponent {
  @Input() orderItem: OrderItem | undefined
}
