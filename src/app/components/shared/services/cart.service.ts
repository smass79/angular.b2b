import { Injectable } from '@angular/core';
import { Product } from 'src/app/modals/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from 'src/app/modals/cart-item';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { ResponseI } from './ResponseI';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("cartItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class CartService extends ApiService {

// Array
public cartItems  :  BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
public observer   :  Subscriber<{}>;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    super(httpClient);
    this.cartItems.subscribe(
      products => products = products
    );
   }

    // Get Products
  public getItems(): Observable<CartItem[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
  }

   // Add to cart
   public addToCart(product: Product, quantity: number) {
    let message, status;
     var item: CartItem | boolean = false;
     // If Products exist
     let hasItem = products.find((items, index) => {
       if(items.product.id == product.id) {
         //let qty = products[index].quantity + quantity;
         let qty =  quantity;
         let stock = this.calculateStockCounts(products[index], quantity);
         if(qty != 0 && stock) {
           products[index]['quantity'] = qty;
           message = 'El producto ' + product.name + ' fue agregado correctamente.';
           status = 'success';
           this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
         }
         return true;
       }
     } );

     // If Products does not exist (Add New Products)
     if(!hasItem) {
      item = { product: product, quantity: quantity };
      products.push(item);
      message = 'El producto ' + product.name + ' fue agregado correctamente.';
      status = 'success';
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
  }

     localStorage.setItem("cartItem", JSON.stringify(products));
     return item;

   }

// Calculate Product stock Counts
public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
  let message, status;
  let qty   = product.quantity + quantity;
  let stock = product.product.stock;
  if(stock < qty) {
    // this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
    this.snackBar.open('You can not choose more items than available. In stock ' + stock + ' items.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    return false
  }
  return true
}


public removeAll(){
  products =  [];
  localStorage.setItem("cartItem", JSON.stringify(products));
}


// Removed in cart
public removeFromCart(item: CartItem) {
  if (item === undefined) return false;
    const index = products.indexOf(item);
    products.splice(index, 1);
    localStorage.setItem("cartItem", JSON.stringify(products));
}

// Total amount
public getTotalAmount(): Observable<number> {
  return this.cartItems.pipe(map((product: CartItem[]) => {
    return products.reduce((prev, curr: CartItem) => {
      return prev + parseFloat(curr.product.price.toString()) * curr.quantity;
    }, 0);
  }));
}

// Total amount
public getTotalConIvaAmount(): Observable<number> {
  return this.cartItems.pipe(map((product: CartItem[]) => {
    return products.reduce((prev, curr: CartItem) => {
      return prev + (parseFloat(curr.product.price.toString()) + (parseFloat(curr.product.price.toString()) * parseFloat(curr.product.alicIva.toString()) / 100)) *  curr.quantity;
    }, 0);
  }));
}

// Update Cart Value
public updateCartQuantity(product: Product, quantity: number): CartItem | boolean {


  return products.find((items, index) => {
    if(items.product.id == product.id) {
      let qty = parseFloat(products[index].quantity) + parseFloat(quantity.toString());
      let stock = this.calculateStockCounts(products[index], quantity);
      if (qty != 0 && stock)
        products[index]['quantity'] = qty;
      localStorage.setItem("cartItem", JSON.stringify(products));
      return true;
    }
  });
}

// Update Cart Value
public setCartQuantity(product: Product, quantity: number): CartItem | boolean {


  return products.find((items, index) => {
    if(items.product.id == product.id) {
      let qty = parseFloat(quantity.toString());
      products[index]['quantity'] = qty;
      localStorage.setItem("cartItem", JSON.stringify(products));
      return true;
    }
  });
}

//
public sendCart(arr_items:any[],
                pNota:string):Observable<ResponseI> {

  let SubTotal=0;
  let Total=0;    
  arr_items.forEach(function(a){SubTotal += a.SubTotal; Total += a.TOTAL});

  let headers = this._headers;
  let params = new FormData();

  params.append('VendedorId', "0");
  params.append('odvMonto', Total.toFixed(2).toString());
  params.append('ClienteId ', "0");
  params.append('Nota', pNota);
  params.append('odvSubTotal', SubTotal.toFixed(2).toString());
  params.append('productos', JSON.stringify( arr_items));

  
  const options = {  headers: headers };
  return this._httpcli.post<ResponseI>(this.URL_SERVER + "addpedido", params, options );
}


}
