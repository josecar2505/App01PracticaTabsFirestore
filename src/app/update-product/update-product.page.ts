import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage {

  public productForm : FormGroup;
  
  constructor(private formBuilder:FormBuilder, private productService: ProductService, private toastController: ToastController, private router: Router) {
    var productAct = this.productService.getProductAct();

    this.productForm = this.formBuilder.group({
      name: [productAct.name,Validators.required],
      price: [productAct.price,Validators.required],
      description: [productAct.description],
      type: [productAct.type,Validators.required],
      photo: [productAct.photo,Validators.required],
    });
   }
  
   async updateProduct() {
    //console.log("Estos son los datos del productoaActualizar",this.productForm.value);
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.productService.updateProduct(product).then( async (result) => {
            console.log('Producto actualizado correctamente');            
            const toast = await this.toastController.create({
              message: 'Producto actualizado correctamente',
              duration: 2000, // Duración de 2 segundos
              position: 'top' // Posición superior
            });
            toast.present();
      }).catch((error) => {
        console.log("Error");
      });
    } else {
      console.warn('El formulario no es válido. Por favor, completa todos los campos requeridos.');
    }

    // Redirigir a la pestaña tab1
    this.router.navigate(['/tabs/tab1']);
  }

  
}
