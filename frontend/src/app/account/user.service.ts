import '@app/shared/rxjs-operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserWithProject } from '@app/core/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public list(): Observable<UserWithProject[]> {
    return this
      .http
      .get<any>(`${environment.apiUrl}/api/users/`)
      .map(({ users }) => users.map((user) => UserWithProject.fromJson(user)))
      .catch((_error) => Observable.of(null));
  }

  public resetPassword(id: number, passwordParams: any): Observable<User> {
    const params = {
      password_params: {
        old_password: passwordParams.oldPassword,
        password: passwordParams.password,
        password_confirmation: passwordParams.passwordConfirmation
      }
    };

    return this
      .http
      .put<any>(`${environment.apiUrl}/api/users/${id}/reset-password`, params)
      .map(({ user }) => User.fromJson(user))
      .catch((_error) => Observable.of(null));
  }

  public update(id: number, userParams: any): Observable<User> {
    const params = {
      user: {
        name: userParams.name
      }
    };

    return this
      .http
      .put<any>(`${environment.apiUrl}/api/users/${id}`, params)
      .map(({ user }) => User.fromJson(user))
      .catch((_error) => Observable.of(null));
  }
}
