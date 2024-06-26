import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/modals/product.model';
import { ProductService } from 'src/app/components/shared/services/product.service';

@Component({
  selector: 'app-popular-products',
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.sass']
})
export class PopularProductsComponent implements OnInit {

  public products: Product[]=[];
  public product            :   Product = {};
  //public productosDestacados: Product[]=[];

   constructor(private productService: ProductService) { }
 
   ngOnInit() {
     //this.productService.getProducts().subscribe(product => this.products = product);

     this.productService.productosDestacados()
     .subscribe((res) => {
           for (var product of res.payload) {
            this.products.push(this.productService.toProducto(product));
           }

       }
     )

   }
}
