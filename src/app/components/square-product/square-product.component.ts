import { Component, Input } from '@angular/core';
import { Product } from '../../shared/interfaces/product';

@Component({
  selector: 'app-square-product',
  imports: [],
  templateUrl: './square-product.component.html',
  styleUrl: './square-product.component.css'
})
export class SquareProductComponent {
  @Input() product: Product | undefined
}
