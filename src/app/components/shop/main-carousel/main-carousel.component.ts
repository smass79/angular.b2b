import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.sass']
})
export class MainCarouselComponent implements OnInit {

  @Input('slides') slides: Array<any> = [];
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  constructor(private router: Router) { }

  ngOnInit() {
  
  }

  openMainBanner(link:string, newwindows:boolean){
    
    if (newwindows){
          window.open(link);
    }else{
          location.href=link;
    }

    /*
    window.open(
      link,
      '_blank'
    );
    */
  }

  ngAfterViewInit(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      initialSlide: 5,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide"
    }
  }




}
