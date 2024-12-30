import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}