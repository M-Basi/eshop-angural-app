import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./components/product-list/product-list.component";
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListAdminComponent } from './components/products-list-admin/products-list-admin.component';
import { ListGroupMenuComponent } from './components/list-group-menu/list-group-menu.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, ListGroupMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eshop';
}
