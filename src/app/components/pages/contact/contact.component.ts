import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit {

  direccion:string;
  telefono:string;
  mail:string;
  iframe:SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.direccion = environment.direccion;
    this.telefono = environment.telcontacto;
    this.mail = environment.mailcontacto;
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q=" +  this.direccion  + "&t=&z=14&ie=UTF8&iwloc=&output=embed");
  }

}
