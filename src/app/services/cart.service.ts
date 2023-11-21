import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cart, Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = {
    items: [],
    total: 0,
    itemCount: 0
  };

  private cartCollection: AngularFirestoreCollection<Cart>;
  private cartDocId = 'user-cart'; // ID único para el documento del carrito

  constructor(private firestore: AngularFirestore) {
    this.cartCollection = this.firestore.collection<Cart>('carts');
  }

  public getCart(): Cart {
    return this.cart;
  }

  public addToCart(product: Product): Cart {
    const existingCartItem = this.cart.items.find((item) => item.product.name === product.name);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: 1,
      };
      this.cart.items.push(newItem);
    }

    this.updateCart();
    return this.cart;
  }

  public removeItemFromCart(item: CartItem, quantityToRemove: number) {
    const index = this.cart.items.findIndex((cartItem) => cartItem === item);
    if (index !== -1) {
      if (item.quantity > quantityToRemove) {
        item.quantity -= quantityToRemove;
      } else {
        this.cart.items.splice(index, 1);
      }

      this.updateCart();
    }
  }

  private updateCart() {
    this.cart.total = this.calculateTotal(this.cart);
    this.cart.itemCount = this.calculateItemCount(this.cart);

    // Actualiza el carrito en Firestore
    this.updateCartInFirestore();
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private calculateItemCount(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCartInFirestore() {
    // Guarda el carrito en Firestore
    this.cartCollection.doc(this.cartDocId).set({
      items: this.cart.items, // Ahora podemos almacenar directamente los items del carrito en Firestore
      total: this.cart.total,
      itemCount: this.cart.itemCount
    });
  }

}
