import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.sass']
})
export class AboutUsComponent implements OnInit {

  constructor() { }
  ABOUTTitulo:string;
  ABOUTBajada:string;

  ngOnInit() {
    this.ABOUTTitulo = environment.abouttitulo;
    this.ABOUTBajada = environment.aboutbajada;
  }

}
