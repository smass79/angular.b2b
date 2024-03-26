import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/components/shared/services/product.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Product, ColorFilter } from 'src/app/modals/product.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { trigger } from '@angular/animations';
import { oUser } from 'src/app/modals/user';
import { AccountService } from 'src/app/components/shared/services/account.service';



@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.sass'],
  animations: [
    trigger('Animation', [

    ]),
  ]
})
export class ProductLeftSidebarComponent implements OnInit {
  public sidenavOpen:boolean = true;
  public animation    :   any;   // Animation
  public sortByOrder  :   string = '';   // sorting
  public page:any;
  public tagsFilters  :   any[] = [];
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public filterForm: FormGroup;
  public colorFilters :   ColorFilter[] = [];

  public items        :   Product[] = [];
  public allItems: Product[] = [];
  public products: Product[] = [];
  public tags         :   any[] = [];
  public colors       :   any[] = [];
  public category;
  public contentLoaded : boolean = false;
  public user:oUser;
  public title:string = "Shop";
  public nodata:boolean = false;

  constructor(private productService: ProductService, 
              private route: ActivatedRoute,
              private router: Router,
              private accountService :AccountService ) {
                
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              


  }

  ngOnInit() {
          this.user = this.accountService.getAccount();          
          this.category = this.route?.snapshot?.paramMap?.get("category");


          if (this.category!=0){
            this.productService.getProductByCategoryID(this.category).subscribe(res => {
                this.nodata = true;
                this.allItems = [];
                if (res.payload!=null){
                  for (var product of res.payload) {
                    this.allItems.push(this.productService.toProducto(product,this.user?.cliBonif || 0));
                  }
                  this.nodata = false;
                }
                this.title = "Shop / " + res.extras;
                this.getTags(this.allItems);
                this.getColors(this.allItems);
                this.contentLoaded=true;
            })
          }else{
            this.route.queryParams.subscribe(params => {
             
              this.productService.getProductByName(params["string"]).subscribe(res => {
                this.title = "Buscar / " + params["string"];
                this.nodata = true;
                this.allItems = [];

                if (res.payload!=null){
                  for (var product of res.payload) {
                      this.allItems.push(this.productService.toProducto(product,this.user?.cliBonif || 0));
                  }            
                  this.nodata = false;
                }
              
                this.getTags(this.allItems);
                this.getColors(this.allItems);
                this.contentLoaded=true;
            })

            });

          }


  }

     // Get current product tags
     public getTags(products) {
      var uniqueBrands = []
      var itemBrand = Array();
      products.map((product, index) => {
         if(product.tags) {
            product.tags.map((tag) => {
            const index = uniqueBrands.indexOf(tag);
            if(index === -1)  uniqueBrands.push(tag);
         })
        }
      });
      for (var i = 0; i < uniqueBrands.length; i++) {
           itemBrand.push({brand:uniqueBrands[i]})
      }
      this.tags = itemBrand
   }

     // Get current product colors
     public getColors(products) {
      var uniqueColors = []
      var itemColor = Array();
      products.map((product, index) => {
        if(product.colors) {
        product.colors.map((color) => {
            const index = uniqueColors.indexOf(color);
            if(index === -1)  uniqueColors.push(color);
        })
       }
      });
      for (var i = 0; i < uniqueColors.length; i++) {
           itemColor.push({color:uniqueColors[i]})
      }
      this.colors = itemColor
   }





  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }
    // Animation Effect fadeIn
    public fadeIn() {
      this.animation = 'fadeIn';
  }

  // Animation Effect fadeOut
  public fadeOut() {
      this.animation = 'fadeOut';
  }

    // Update tags filter
    public updateTagFilters(tags: any[]) {
      this.tagsFilters = tags;
      this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }



    // sorting type ASC / DESC / A-Z / Z-A etc.
    public onChangeSorting(val) {
      this.sortByOrder = val;
      this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
   }

     // Initialize filetr Items
  public filterItems(): Product[] {
    return this.items.filter((item: Product) => {
        const Colors: boolean = this.colorFilters.reduce((prev, curr) => { // Match Color
          if(item.colors){
            if (item.colors.includes(curr.color)) {
              return prev && true;
            }
          }
        }, true);
        const Tags: boolean = this.tagsFilters.reduce((prev, curr) => { // Match Tags
          if(item.tags) {
            if (item.tags.includes(curr)) {
              return prev && true;
            }
          }
        }, true);
        return Colors && Tags; // return true
    });

}

public onPageChanged(event){
  this.page = event;
  this.allItems;
  window.scrollTo(0,0);
}


  // Update price filter
//   public updatePriceFilters(price: any) {
//     let items: any[] = [];
//     this.products.filter((item: Product) => {
//         if (item.price >= price[0] && item.price <= price[1] )  {
//            items.push(item); // push in array
//         }
//     });
//     this.items = items;
// }


  // Update price filter
  public updatePriceFilters(price: any) {
    console.log(price);
    console.log(this.products);


   this.allItems = this.products.filter((item: Product) => {
     return item.price >= price.priceFrom && item.price <= price.priceTo
    });
     console.log(this.products);

}

onBrendsChanged(newBrend) {
  console.log(newBrend);
  this.allItems = newBrend === 'all' ? this.products : this.products.filter(

    item => item.brand === newBrend
  )
  console.log(this.allItems);


}
}
