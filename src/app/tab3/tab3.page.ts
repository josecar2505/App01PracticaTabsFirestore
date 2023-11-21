import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  favorites:Product[]=[];
  public products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService,) {
    this.productService.getProductsFavorites().subscribe((products: Product[]) => {
      this.favorites = products;
      this.productService.getProducts().subscribe((products: Product[]) => {
        this.products = products;
    })
    });
  }

  ngOnInit() {
   
  }

  public addToCart(product: Product, i: number) {
    product.photo = product.photo + i;
    this.cartService.addToCart(product);
    console.log(this.cartService.getCart());
  }

  getColor(productType: string): string {
    switch (productType) {
      case 'Abarrotes':
        return 'primary';
      case 'Frutas y verduras':
        return 'success';
      case 'Limpieza':
        return 'warning';
      case 'Farmacia':
        return 'danger';
      default:
        return '';
    }
  }

  removeFromFavorites(product: Product) {
    this.productService.removeFromFavorites(product);
  }
}
