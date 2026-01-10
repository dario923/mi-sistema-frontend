import { UserResponse } from './../models/user.interface';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';
// Asegúrate de que esta línea esté exactamente así:
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService) { }

  canActivate(): Observable<boolean> {
    // Usamos pipe para encadenar los operadores
    return this.authSvc.user$.pipe(
      take(1),
      // Simplificamos la lógica: si NO hay usuario, puede activar (true)
      map((user: UserResponse | null) => !user)
    );
  }
}
