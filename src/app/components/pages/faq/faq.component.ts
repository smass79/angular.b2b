import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {

  constructor() { }

  faq01titulo:string;
  faq01bajada:string;
  faq02titulo:string;
  faq02bajada:string;
  faq03titulo:string;
  faq03bajada:string;
  faq04titulo:string;
  faq04bajada:string;


  ngOnInit() {

    this.faq01titulo = environment.faq01titulo;
    this.faq01bajada = environment.faq01bajada;
    this.faq02titulo = environment.faq02titulo;
    this.faq02bajada = environment.faq02bajada;
    this.faq03titulo = environment.faq03titulo;
    this.faq03bajada = environment.faq03bajada;
    this.faq04titulo = environment.faq04titulo;
    this.faq04bajada = environment.faq04bajada;
  }

}
