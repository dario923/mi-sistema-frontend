import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

import { UserResponse, User, Roles } from '../../shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new BehaviorSubject<UserResponse | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get user$(): Observable<UserResponse | null> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse | null {
    return this.user.getValue();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http
      .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        map((user: UserResponse) => {
          this.saveLocalStorage(user);
          this.user.next(user);
          return user;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  // ESTE ES EL MÉTODO QUE FALTABA:
  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
    this.router.navigate(['/login']);
  }

  private checkToken(): void {
    const item = localStorage.getItem('user');
    const user = item ? JSON.parse(item) : null;

    if (user && user.token) {
      const isExpired = helper.isTokenExpired(user.token);

      if (isExpired) {
        this.logout(); // Ahora ya no dará error
      } else {
        this.user.next(user);
      }
    }
  }

  private saveLocalStorage(user: UserResponse): void {
    const { message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
  }

  private handlerError(err: any): Observable<never> {
    let errorMessage = 'An error occurred retrieving data';
    if (err && err.message) {
      errorMessage = `Error: code ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
