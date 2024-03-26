import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { oUser } from 'src/app/modals/user';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const token = sessionStorage.getItem('user');
    const token = JSON.parse(localStorage.getItem('user'));
    if (!token) {
        return next.handle(req);
    }
    
    const headers = req.clone({
        headers: req.headers.set('authorization', token.Token)
    });
    return next.handle(headers);
  }
}