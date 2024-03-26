import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Observable, of } from 'rxjs';
import { CartItem } from 'src/app/modals/cart-item';
import { ProductService } from '../../shared/services/product.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { oUser } from 'src/app/modals/user';
import { AccountService } from '../../shared/services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass']
})
export class CheckoutComponent implements OnInit {

  public enviando:boolean=false;

  nota;
  public cartItems: Observable<CartItem[]> = of([]);
  public buyProducts: CartItem[] = [];
  public user:oUser;
  amount: number;
  payments: string[] = ['Create an Account?', 'Flat Rate'];
  paymantWay: string[] = ['Direct Bank Transfer', 'PayPal'];

  MydataForm = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
    ciudad: new FormControl(''),
    state: new FormControl(''),
    postcode: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    nota: new FormControl(''),
  });
  

  constructor(private cartService: CartService, 
              public productService: ProductService,
              private router: Router,
              public snackBar: MatSnackBar,
              private accountService :AccountService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.hide();
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.buyProducts = products);
    this.getTotal().subscribe(amount => this.amount = amount);

    this.user = this.accountService.getAccount();
    this.accountService.getmydata().subscribe(res => {

        this.MydataForm.controls["name"].patchValue(res.payload["cliNombre"]);
        this.MydataForm.controls['name'].disable();

        this.MydataForm.controls["address"].patchValue(res.payload["cliDireccion"]);
        this.MydataForm.controls['address'].disable();

        this.MydataForm.controls["ciudad"].patchValue("");
        this.MydataForm.controls['ciudad'].disable();

        this.MydataForm.controls["state"].patchValue("");
        this.MydataForm.controls['state'].disable();

        this.MydataForm.controls["postcode"].patchValue("");
        this.MydataForm.controls['postcode'].disable();

        this.MydataForm.controls["email"].patchValue(res.payload["cliEmail"]);
        this.MydataForm.controls['email'].disable();

        this.MydataForm.controls["phone"].patchValue(res.payload["cliCelular"]);
        this.MydataForm.controls['phone'].disable();

    });

  }

  public setForm(){

  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public getTotalConIVA(): Observable<number> {
    return this.cartService.getTotalConIvaAmount();
  }


  public EnviarPedido(){

    this.enviando = true;
    this.spinner.show();

    const newdata = this.buyProducts.map((x) => {
      let vPUCImp =  parseFloat(x.product.price.toString()) + (parseFloat(x.product.price.toString()) * parseFloat(x.product.alicIva.toString()) / 100);

      return { ProductoID: Number(x.product.id), 
               Cantidad: x.quantity,
               PrecioU: x.product.salePrice,
               Dto:0,
               Bon: this.user?.cliBonif,
               Rec:0,
               SubTotal:x.product.price  *  x.quantity,
               TOTAL: parseFloat((vPUCImp * x.quantity).toFixed(2)),
               PUCDto:x.product.price,
               PUCImp: vPUCImp,
               PrecioCompra:0,
               RentDeseada:0,
               pofpOfertaProductoId:0,
               monMonedasId:0};
    });
    let SubTotal  = 0;
    let Total     = 0;    
    newdata.forEach(function(a){SubTotal += a.SubTotal; Total += a.TOTAL});  

    this.nota = this.MydataForm.controls["nota"].value || "";
    this.cartService.sendCart(newdata, this.nota || "").subscribe(res => {
        if (res.status=="success"){
          this.snackBar.open("PEDIDO CARGADO CORRECTAMENTE", '×', { panelClass: ['success'], verticalPosition: 'top', duration: 5000 });
          this.cartService.removeAll();
          this.router.navigate(['/']);       
         }else{
          this.snackBar.open("USUARIO O PASSWORD INCORRECTOS", '×', { panelClass: ['error'], verticalPosition: 'top', duration: 5000 });
         }
         this.spinner.hide();
         this.enviando = false;
    });


  }  

}
