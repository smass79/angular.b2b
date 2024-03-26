import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Product } from 'src/app/modals/product.model';
import { oUser } from 'src/app/modals/user';
import { AccountService } from '../../shared/services/account.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  products: Product[];
  productosDestacados: Product[]=[];
  productosOfertas: Product[]=[];
  productosIngresos: Product[]=[];  
  contentLoaded = false;
  public banners = [];
  public slides = [
    { title: 'Ejemplo', subtitle: 'Sub Ejemplo', image: 'assets/images/carousel/banner1.jpg', link:"" },
    { title: 'Biggest discount', subtitle: 'Check the promotion', image: 'assets/images/carousel/banner2.jpg', link:"" },
    { title: 'Biggest sale', subtitle: 'Dont miss it', image: 'assets/images/carousel/banner3.jpg', link:"" },
    { title: 'Our best products', subtitle: 'Special selection', image: 'assets/images/carousel/banner4.jpg', link:"" },
    { title: 'Massive sale', subtitle: 'Only for today', image: 'assets/images/carousel/banner5.jpg', link:"" }
  ];
  user:oUser;
  
  constructor(private productService: ProductService,  
              private accountService :AccountService,
              private router: Router,
              private title: Title,
              private activatedRoute: ActivatedRoute,

              ) { }

  private setPageTitle(): void {
    const defaultPageTitle = 'Default Page Title';
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
    
        if (!child) {
          return this.activatedRoute.snapshot.data.title || defaultPageTitle;
        }
    
        while (child.firstChild) {
          child = child.firstChild;
        }
    
        if (child.snapshot.data.title) {
          return child.snapshot.data.title || defaultPageTitle;
        }
      })
    ).subscribe((title: string) => this.title.setTitle(title));
  }

  ngOnInit() {
    this.setPageTitle();
    
    this.router.navigate(['/home']); 
    this.user = this.accountService.getAccount();

    this.productService.getBanners()
    .subscribe( (data) => {
        this.slides = data["payload"];
    }
    );

    this.productService.getProducts()
    .subscribe(
      (product: Product[]) => {
        this.products = product
      }
    );
 
    this.productService.productosDestacados()
    .subscribe((res) => {
          for (var product of res.payload) {
            this.productosDestacados.push(this.productService.toProducto(product, this.user?.cliBonif || 0));
          }
      }
    )
    
    this.productService.productosOfertas()
    .subscribe((res) => {
          for (var product of res.payload) {
            this.productosOfertas.push(this.productService.toProducto(product, this.user?.cliBonif || 0));
          }
      }
    )

    this.productService.productosIngresos()
    .subscribe((res) => {
          for (var product of res.payload) {
            this.productosIngresos.push(this.productService.toProducto(product, this.user?.cliBonif || 0));
          }
      }
    )

 setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
    
  }






}
