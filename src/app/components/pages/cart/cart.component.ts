import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from 'src/app/modals/cart-item';
import { CartService } from '../../shared/services/cart.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {

  public cartItems : Observable<CartItem[]> = of([]);
  public shoppingCartItems  : CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);

  }


    // Remove cart items
    public removeItem(item: CartItem) {
      this.cartService.removeFromCart(item);
    }

  public valuechange(item: CartItem, qtty){
    console.error(Number(qtty));
    console.error(isNaN(Number(qtty)));
    if(!isNaN(Number(qtty)) && qtty !== true && qtty !== false && qtty!=='') {
      item.error = false;
    } else {
      item.error = true;
      return;
    }
    if (qtty<=0){
          item.error = true;
          return;
    }
    item.quantity = qtty;
    this.cartService.setCartQuantity(item.product,qtty);
  }

  public permitirContinuar(){
    let respuesta:boolean=false;
    this.shoppingCartItems.forEach((item) => {
      if (item.error) respuesta = true; 
    });
   return respuesta;
  }

   // Increase Product Quantity
   public increment(product: any, quantity: number = 1) {
    this.cartService.updateCartQuantity(product,quantity);
  }

  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService.updateCartQuantity(product,quantity);
  }
   // Get Total
   public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

}
