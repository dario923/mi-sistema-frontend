import { UserResponse } from './../../models/user.interface';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../../pages/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Roles } from '../../models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  //isAdmin = null;
  isAdmin: boolean = false;
  isLogged = false;

  private destroy$ = new Subject<any>();

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authSvc: AuthService) { }
  /*
    ngOnInit(): void {
      this.authSvc.user$
        .pipe(takeUntil(this.destroy$))
        .subscribe((user: UserResponse) => {
          this.isLogged = true;
          this.isAdmin = user?.role;
        });
    }*/
  ngOnInit(): void {
    this.authSvc.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: UserResponse | null) => {
        if (user) {
          this.isLogged = true;
          // COMPARACIÓN: Si el rol es 'ADMIN' o 'admin', isAdmin será TRUE
          // Usamos toLowerCase() para que no importe si viene en mayúsculas o minúsculas
          this.isAdmin = user.role.toLowerCase() === 'admin';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authSvc.logout();
  }
}
