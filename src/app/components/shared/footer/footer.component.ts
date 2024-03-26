import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

  direccion:string;
  telefono:string;
  mail:string;
  nrowasap:SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.direccion = environment.direccion;  
    this.telefono = environment.telcontacto;
    this.mail = environment.mailcontacto;

    this.nrowasap = this.sanitizer.bypassSecurityTrustResourceUrl("https://api.whatsapp.com/send?phone="+ environment.wscontacto +"&text=Hola, mi consulta es la siguiente...");
  }

}
