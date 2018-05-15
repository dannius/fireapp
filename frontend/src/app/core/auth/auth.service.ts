import '@app/shared/rxjs-operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@app/core/auth/token.service';
import { User } from '@app/core/models';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PubSubService } from '@app/core/pub-sub.service';

@Injectable()
export class AuthService {

  private readonly TOKEN = 'token';

  private _user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private pubSubService: PubSubService
  ) { }

  public get user(): Observable<User> {
    return this._user.asObservable();
  }

  public isAuthenticated(): boolean {
    return this.user && this._user.getValue() !== null;
  }

  public findSession(): Observable<User> {
    return this.user.take(1).switchMap((user) => {
      if (user !== null) {
        return this.user;
      } else if (this.tokenService.token) {
        return this.session();
      } else {
        return Observable.of(null);
      }
    });
  }

  public setUser(user: User): void {
    this._user.next(user);
  }

  public signup(email: string, password: string): Observable<User> {
    const params = {
      user: { email, password }
    };

    return this
      .http
      .post<User>(`${environment.apiUrl}/api/users`, params)
      .map(({ token, user }: any) => {
        this.setUser(User.fromJson(user));
        this.tokenService.write(token);
        return user;
      });
  }

  public login(email: string, password: string): Observable<User> {
    const params = {
      session: { email, password }
    };

    return this
      .http
      .post<User>(`${environment.apiUrl}/api/session`, params)
      .map(({ token, user }: any) => {
        this.tokenService.write(token);
        this.setUser(User.fromJson(user));
        return user;
      });
  }

  public logout() {
    this.tokenService.clear();
    this.setUser(null);
    this.pubSubService.setUserHelper(null);
    this.pubSubService.setProject(null);
    this.router.navigate(['/session', 'signin']);
  }

  private session(): Observable<User> {
    return this
      .http
      .get<any>(`${environment.apiUrl}/api/session`)
      .map(({ user }) => User.fromJson(user))
      .do((user) => this.setUser(user))
      .catch((_error) => Observable.of(null));
  }

}
