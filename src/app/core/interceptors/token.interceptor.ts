import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    console.log('Interceptor: Request intercepted', request);

    const token = sessionStorage.getItem('token');

    if (token) {
      console.log('Interceptor: Adding Authorization header with token');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continue with the request
    return next.handle(request);
  }
}