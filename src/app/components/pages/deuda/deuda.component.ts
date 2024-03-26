import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from 'src/app/modals/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { AccountService } from '../../shared/services/account.service';
import { documentos } from 'src/app/modals/documentos';

@Component({
  selector: 'app-deuda',
  templateUrl: './deuda.component.html',
  styleUrls: ['./deuda.component.sass']
})
export class DeudaComponent implements OnInit {

  public arr_documentos  : documentos[] = [];
  public arr_documentos_final  :  any[] = [] ;
  
  public deudaTotal:number;
  public loading:boolean=true;
  constructor(private cartService: CartService,
              private accountService :AccountService,) { }

  ngOnInit() {
    this.accountService.getdeuda().subscribe(res => {
      this.arr_documentos = <documentos[]><unknown>res.payload;
      this.deudaTotal = this.arr_documentos.reduce((a, b) => parseFloat(a.toString()) + parseFloat(b.Deuda.toString()), 0);


      console.error(this.arr_documentos);

      this.arr_documentos.forEach( x => {
        const found = this.arr_documentos_final.find((element) => {return element.tptLetra === x.tptLetra;});
        console.error(found);

        if( found == undefined ){     
          this.arr_documentos_final.push({tptLetra:x.tptLetra,
                                          docs: [x]});    
        }else{
          found.docs.push(x)
        }
      });
      console.error(this.arr_documentos_final);
      
      this.loading = false;
    });


  }


    // Remove cart items
    public removeItem(item: CartItem) {
      this.cartService.removeFromCart(item);
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
   public getTotal(tipo:string): number {
    
    return this.arr_documentos.reduce((a, b) => (tipo==b.tptLetra)?parseFloat(a.toString()) + parseFloat(b.Deuda.toString()):a, 0);
  }

}
