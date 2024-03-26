import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/modals/product.model';
import { ProductService } from 'src/app/components/shared/services/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/components/shared/services/cart.service';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { oImagen } from "../../../../modals/imagen";
import { oUser } from 'src/app/modals/user';
import { AccountService } from 'src/app/components/shared/services/account.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass']
})
export class ProductDetailsComponent implements OnInit {

  public config: SwiperConfigInterface={};
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();

  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;

  public product            :   Product = {};
  public products           :   Product[] = [];

  public image: any;
  public zoomImage: any;

  public counter            :   number = 1;
  public ProductoID         :   number;
  index: number;
  bigProductImageIndex = 0;
  loading: boolean = true;
  public contentLoaded : boolean = false;
  arr_img : oImagen[]=[];
  public user:oUser;
  
  public TituloDestacado:string = "Productos Destacados";

  constructor(private route: ActivatedRoute, 
              public productsService: ProductService, 
              public dialog: MatDialog, 
              private router: Router, 
              private cartService: CartService,
              private accountService :AccountService) {
    /*
    this.route.params.subscribe(params => {
      const id =  params['id'];
      this.productsService.getProduct(id).subscribe(product => this.product = this.productsService.toProducto( product))
    });
    */
    this.ProductoID = Number(this.route.snapshot.paramMap.get('id'));

  }




  ngOnInit() {
    this.productsService.getProduct(this.ProductoID).subscribe(
      (data) => {
        this.user = this.accountService.getAccount();       
        this.product = this.productsService.toProducto(data.payload[0],this.user?.cliBonif || 0);     
          
        this.productsService.productsImgExist(this.product.pictures).subscribe(res=>{
            //console.error(res.payload);
            this.product.pictures = res.payload;
        });
        this.contentLoaded=true;
      });
    this.getRelatedProducts();
  }



  public imgError(image){

    //image.parentNode.parentNode.style.display = 'none';
    //console.error( "paretnt" );
    //console.error( image.parentNode.parentNode );
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 3,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 3,
        },


      }
    }
  }


  public openProductDialog(product, bigProductImageIndex) {
    let dialogRef = this.dialog.open(ProductZoomComponent, {
      data: {product, index: bigProductImageIndex },
      panelClass: 'product-dialog',
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }


  public selectImage(index) {
    this.bigProductImageIndex = index;
    this.product.pathimg = this.product.pictures[index].small;
  }




public increment() {
  this.counter += 1;
}

public decrement() {
  if(this.counter >1){
     this.counter -= 1;
  }
}

getRelatedProducts() {
 
  this.productsService.productosRelacionados(this.ProductoID)
  .subscribe((res) => {
        this.TituloDestacado = "Productos Relacionados";
        for (var product of res.payload) {
         this.products.push(this.productsService.toProducto(product));
        }
        if (this.products.length==0){
          this.productsService.productosDestacados()
                .subscribe((res) => {
                      for (var product of res.payload) {
                              this.products.push(this.productsService.toProducto(product));
                      }
                      this.TituloDestacado = "Productos Destacados";
                }
                )
        }
    }
  )

}



  // Add to cart
  public addToCart(product: Product, quantity?) {
    if (quantity == 0) return false;

    this.cartService.addToCart(product, this.counter);
  }

  // Add to cart
  public buyNow(product: Product, quantity) {
    if (quantity > 0)
      this.cartService.addToCart(product,parseInt(quantity));
      this.router.navigate(['/pages/checkout']);
  }



 public onMouseMove(e){
  if(window.innerWidth >= 1280){
    var image, offsetX, offsetY, x, y, zoomer;
    image = e.currentTarget;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    x = offsetX/image.offsetWidth*100;
    y = offsetY/image.offsetHeight*100;
    zoomer = this.zoomViewer.nativeElement.children[0];
    if(zoomer){
      zoomer.style.backgroundPosition = x + '% ' + y + '%';
      zoomer.style.display = "block";
      zoomer.style.height = image.height + 'px';
      zoomer.style.width = image.width + 'px';
    }
  }
}

public onMouseLeave(event){
  this.zoomViewer.nativeElement.children[0].style.display = "none";
}

public openZoomViewer(){
  this.dialog.open(ProductZoomComponent, {
    data: this.zoomImage,
    panelClass: 'zoom-dialog'
  });
}

onLoad() {
  this.loading = false;
}

}


