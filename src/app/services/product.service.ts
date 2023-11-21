import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Observable<Product[]>;
  private favorites: Observable<Product[]>;
  private productCollection : AngularFirestoreCollection<Product>;
  private favoritesCollection: AngularFirestoreCollection<Product>;
  private productact: Product = {
    id: "",
    name: "",
    price: 0,
    description: "",
    type: "",
    photo: ""
  };
  constructor(private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection<Product>('products');
    this.favoritesCollection = this.firestore.collection<Product>('favorites');
    this.products = this.productCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.favorites = this.favoritesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  getProducts(): Observable<Product[]> {
    return this.products;
  }

  getProductsFavorites(): Observable<Product[]> {
    return this.favorites;
  }
  
  saveProduct(product: Product): Promise<string> {
    return this.productCollection.add(product).then((doc) => {
      console.log("Producto añadido con id" + doc.id); return "success";
    }).catch((error) => {
      console.log("Error al anadir el producto" + error); return "error";
    });
  }

 
  public deleteProduct(product: Product): Promise<void> {
    return this.productCollection.doc(product.id).delete();
  }

  public updateProduct(product: Product): Promise<void> {
    return this.productCollection.doc(this.productact.id).update(product);
  }

  public getProductAct(): Product {
    return this.productact;
  }
  public setProductAct(product: Product): void {
    this.productact = product;
  }

  addToFavorites(product: Product): Promise<void> {
    // Verificar si el producto ya existe en la colección de favoritos por su nombre
    return this.favoritesCollection.ref
      .where('name', '==', product.name)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          // El producto ya existe en la colección de favoritos, no es necesario agregarlo nuevamente
          console.log('El producto ya está en la lista de favoritos.');
          return Promise.resolve();
        } else {
          // Añadir el producto a la colección de favoritos
          return this.favoritesCollection.add(product).then(() => {
            console.log('Producto agregado a favoritos con éxito');
          });
        }
      })
      .catch((error) => {
        console.error('Error al verificar la existencia del producto en favoritos:', error);
        return Promise.reject();
      });
  }

  removeFromFavorites(product: Product): Promise<void> {
    console.log(product.id);
    return this.favoritesCollection.ref
      .where('id', '==', product.id)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          // Utilizamos Promise.all para manejar múltiples eliminaciones de documentos
          const deletionPromises: Promise<void>[] = [];
          
          querySnapshot.forEach((doc) => {
            deletionPromises.push(doc.ref.delete());
          });
  
          // Devolvemos una promesa que se resuelve cuando todas las eliminaciones se completan
          return Promise.all(deletionPromises).then(() => {
            console.log('Producto eliminado de favoritos con éxito');
          });
        } else {
          console.log('Producto no encontrado en la lista de favoritos');
          return Promise.resolve();
        }
      })
      .catch((error) => {
        console.error('Error al intentar eliminar el producto de favoritos:', error);
        return Promise.reject();
      });
  }
  
}
