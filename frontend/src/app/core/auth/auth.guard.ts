import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public canActivate(): Observable<boolean> {
    // NOTE: we call this so that if we don't have user, we fetch it the first time

    return this
      .authService
      .findSession()
      .map((user) => user !== null)
      .map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/session', 'signin']);
        }

        return isAuthenticated;
      });
  }
}
