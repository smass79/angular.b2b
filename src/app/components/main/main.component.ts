import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Product} from "../../modals/product.model";
import {CartItem} from "../../modals/cart-item";
import {ProductService} from "../shared/services/product.service";
import {CartService} from "../shared/services/cart.service";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarMenuService } from '../shared/sidebar/sidebar-menu.service';
import { SidenavMenu } from '../shared/sidebar/sidebar-menu.model';
import { MenuService } from '../shared/services/menu.service';
import { oUser } from 'src/app/modals/user';
import { AccountService } from '../shared/services/account.service';

interface oMenu {
  displayName: string,
  iconName: string,
  route: string,
  children?:any[]
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  user:oUser;
  public sidenavMenuItems:Array<any>;

  public currencies = ['USD', 'EUR'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag:any;

  products: Product[];

  indexProduct: number;
  shoppingCartItems: CartItem[] = [];

  public banners = [];

  wishlistItems  :   Product[] = [];

  public url : any;
  menu:any[];
  menufinal:oMenu[]=[];

  navItems: SidenavMenu[] = [
    {
      displayName: 'HOME',
      iconName: 'recent_actors',
      route: '/home/'
    },
    {
      displayName: 'PRODUCTOS',
      iconName: 'movie_filter',
      children: []
    },
    {
      displayName: 'QUIENES SOMOS',
          iconName: 'feedback',
          route: '/pages/about'
    },
    {
      displayName: 'FAQ',
          iconName: 'feedback',
          route: '/pages/faq'
    },
    {
      displayName: 'Contacto',
          iconName: 'feedback',
          route: '/pages/contact'
    }
  ];

  constructor(public router: Router, 
              private cartService: CartService, 
              public sidenavMenuService:SidebarMenuService,
              public menuService: MenuService,
              private accountService :AccountService) {
    this.cartService.getItems().subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    } )
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
      this.currency = this.currencies[0];

      this.menuService.getmenu().subscribe((res) => {

        this.menu =  Array.from(res.payload);
        for (var imenu of this.menu) {
              let submenuoriginal:any[]=Array.from(imenu.submenu);
              let submenu:oMenu[]=[];
              for (var isubmenu of submenuoriginal) {
                submenu.push({"displayName":isubmenu.scaDescripcion,
                              "iconName":"",
                              "route":"/home/products/" + isubmenu.scaSubCategoriaId +"/left-sidebar"});
              }  
              let currentOmenu:oMenu = {"displayName":imenu.catDescripcion,
                                        "children":submenu,
                                        "iconName":"",
                                        "route":""};
              this.menufinal.push(currentOmenu);                       
        }
        let item1 = this.navItems.find(i => i.displayName === "PRODUCTOS");
        item1.children = this.menufinal;
    })


    this.user = this.accountService.getAccount();

  }


  public onSalirClick(){
    this.accountService.logout();
    this.cartService.removeAll();                       
    window.location.reload();
 
  }


  public changeCurrency(currency){
    this.currency = currency;
  }
  public changeLang(flag){
    this.flag = flag;
  }

}
