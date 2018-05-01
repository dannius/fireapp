import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@app/core/auth/token.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly UNAUTHORIZED = 401;

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.token;
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    const onError = (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === this.UNAUTHORIZED) {
        this.router.navigate(['/session', 'signin']);
      }
    };

    return next.handle(newRequest).do(null, onError);
  }
}
