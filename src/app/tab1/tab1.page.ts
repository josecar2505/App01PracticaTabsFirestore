import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public products: Product[] = [];
  public productsFounds: Product[] = [];
  currentProduct: Product = {
    name: '',
    price: 0,
    type: '',
    photo: ''
  };

  public filter = [
    "Abarrotes",
    "Frutas y Verduras",
    "Limpieza",
    "Farmacia",
  ];

  public colors = [
    {
      type: "Abarrotes",
      color: "primary"
    },
    {
      type: "Frutas y Verduras",
      color: "secondary"
    },
    {
      type: "Limpieza",
      color: "warning"
    },
    {
      type: "Farmacia",
      color: "danger"
    }
  ];
  toastController: any;

  constructor(private cartService: CartService, private router: Router, private productService: ProductService, private authService: AuthService, private alertController: AlertController) {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.productsFounds = this.products;
    });

  }

  public getColor(type: string): string {
    const itemFound = this.colors.find((element) => {
      return element.type === type;
    });
    let color = itemFound && itemFound.color ? itemFound.color : "";
    return color;
  }

  public filterProducts(): void {
    console.log(this.filter);
    this.productsFounds = this.products.filter(
      item => {
        return this.filter.includes(item.type);
      }
    );
  }

  public addToCart(product: Product, i: number) {
    product.photo = product.photo + i;
    this.cartService.addToCart(product);
    console.log(this.cartService.getCart());
  }

  public openActProductPage(rut : string, product: Product) {
    this.productService.setProductAct(product);
    this.router.navigate([rut]);
  }

  
  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿deseas eliminar?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: (data) => {
            this.productService.deleteProduct(product).then(() => {
              console.log("Producto eliminado correctamente");
            }).catch((error) => {
              console.log("Error al eliminar el producto" + error);
            }); 
          },
        },
      ],
    });
  
    await alert.present();
  }

  openProductAddPage() {
    this.router.navigate(['/add-product']); // Asume que la ruta 'product-add' existe para añadir productos.
  }
  

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

 
  addToFavorites(product: Product) {
    this.productService.addToFavorites(product);
  }
}


