import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from "./api.service";
import { ResponseI } from './ResponseI';
import { oUser } from 'src/app/modals/user';

@Injectable({
    providedIn: 'root'
  })

export class AccountService  extends ApiService {

    constructor(private httpClient: HttpClient) {
        super(httpClient);
    
    }

    public changuePassword(pass: string, passnew:string): Observable<ResponseI> {

      let headers = this._headers;
      let params = new FormData();
      params.append('pass', pass);
      params.append('passnew', passnew);
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "changepassword", params, options );
  

  }

    public login(usuario: string, pass:string): Observable<ResponseI> {

        let headers = this._headers;
        let params = new FormData();
        params.append('usuario', usuario);
        params.append('pass', pass);
        const options = {  headers: headers };
        return this._httpcli.post<ResponseI>(this.URL_SERVER + "login", params, options );
    

    }

    public sendAccount(usuario: string, pass:string): Observable<ResponseI> {

      let headers = this._headers;
      let params = new FormData();
      params.append('nrousuario', usuario);
      params.append('usumail', pass);
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "getaccount", params, options );
  
    }

    public getdeuda(): Observable<ResponseI> {

      let headers = this._headers;
      let params = new FormData();
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "getdeuda", params, options );
  

    }

    public getmydata(): Observable<ResponseI> {

      let headers = this._headers;
      let params = new FormData();
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "getmydata", params, options );
  

    }

    public getAccount():oUser{
      return JSON.parse(localStorage.getItem("user")) || undefined;
    }
    public storeAccount(user){
      localStorage.setItem("user", JSON.stringify(user));
    }
    public logout(){
      localStorage.removeItem("user");
    }
}    