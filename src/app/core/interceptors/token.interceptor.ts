import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = sessionStorage.getItem('token');

    if (token) {
      console.log("Interceptado");
      console.log(request);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
