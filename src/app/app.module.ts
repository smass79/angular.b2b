import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoComponent } from './components/demo/demo.component';
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MainComponent } from './components/main/main.component';
import { AppRoutingModule } from './app-routing.module';
import { ShopModule } from './components/shop/shop.module';
import { SharedModule } from './components/shared/shared.module';
import { ColorOptionsComponent } from './components/color-options/color-options.component';
import { AuthInterceptor } from './components/shared/services/auth.interceptor';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    MainComponent,
    ColorOptionsComponent



  ],
  imports: [
    BrowserModule,
    SharedModule,
    ShopModule,
    NgxSkeletonLoaderModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxImgZoomModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
