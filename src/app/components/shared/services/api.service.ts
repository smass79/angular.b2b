import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';



import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  

  URL_SERVER:string= environment.API_URL;
  _httpcli:HttpClient;
  public _headers:HttpHeaders;

  public  _STR_TOKEN;

  constructor(private http: HttpClient) { 
      this._httpcli = http;
      var token;
      this._headers = new HttpHeaders();
     // token =  sessionStorage.getItem('auth-token');
    //  this._headers = this._headers.append('authorization', token);
      //   console.log(this._headers.has('authorization'));
      /*
      if(this._headers.has('authorization')) {
        token  =  sessionStorage.getItem('auth-token');
        this._headers = this._headers.append('authorization', token);
      }
      */
  }


   // Http Options
   httpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json'})
   }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };





}
