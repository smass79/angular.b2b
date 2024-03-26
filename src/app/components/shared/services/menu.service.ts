import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/modals/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ResponseI } from './ResponseI';



// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class MenuService  extends ApiService {

    constructor(httpCli: HttpClient) {
        super(httpCli);
    }

    getmenu():Observable<ResponseI>{
        let headers = this._headers;
        let params = new FormData();
        const options = {  headers: headers };
    
        return this._httpcli.post<ResponseI>(this.URL_SERVER + "getmenu", params, options );
      }
}    