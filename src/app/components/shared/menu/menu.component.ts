import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { ActivatedRoute } from '@angular/router';

interface oMenu {
  catDescripcion?: any;
  submenu?: any[][];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})



export class MenuComponent implements OnInit {

  menu:any[];
  menufinal:oMenu[]=[];
  constructor(public menuService: MenuService
    ) { }

  ngOnInit() {
   
    this.menuService.getmenu().subscribe((res) => {
        let qttyXColum = 10;
        this.menu =  Array.from(res.payload);
        for (var imenu of this.menu) {
          let submenuoriginal:any[]=Array.from(imenu.submenu);
          submenuoriginal.sort(function(a,b){
            return a.scaDescripcion.localeCompare(b.scaDescripcion);
          })

          let mitad = Math.ceil(submenuoriginal.length / qttyXColum);        
          if (mitad>0){
            let inicio = 0;
            for (let i = 1; i < mitad + 1; i++) {              
              var primeraParte = submenuoriginal.slice(inicio, inicio + qttyXColum);
              let currentOmenu:oMenu = {"catDescripcion":(i==1)?imenu.catDescripcion:"" ,
                                        "submenu":[]};
              currentOmenu.submenu.push( primeraParte) ;   
              inicio = inicio + qttyXColum;
              this.menufinal.push(currentOmenu); 
            }
              
          }else{
              let currentOmenu:oMenu = {"catDescripcion":imenu.catDescripcion , 
                                        "submenu":[]};
              currentOmenu.submenu.push( submenuoriginal) ;                      


              this.menufinal.push(currentOmenu);                       
          }
        }

    })
    
  }
  openMegaMenu(){
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }
    });
  }


}
