import { AuthService } from '../../pages/auth/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificamos si la URL incluye 'users'
    if (req.url.includes('users')) {
      const userValue = this.authSvc.userValue;

      // Verificamos que el usuario exista y tenga un token antes de usarlo
      if (userValue && userValue.token) {
        const authReq = req.clone({
          setHeaders: {
            auth: userValue.token, // Solo se añade si el token existe
          },
        });
        return next.handle(authReq);
      }
    }

    // Si no es la ruta de users o no hay token, la petición sigue normal
    return next.handle(req);
  }
}
