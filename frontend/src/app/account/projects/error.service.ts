import '@app/shared/rxjs-operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '@app/core/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { Error } from '@app/core/models/error';

@Injectable()
export class ErrorService {

  constructor(
    private http: HttpClient
  ) { }

  public update(id: number, { description, userId }: any): Observable<Project> {
    const errorParams = {
      description: description || '',
      user_id: userId || ''
    };

    return this
      .http
      .put<any>(`${environment.apiUrl}/api/errors/${id}`, { error: errorParams })
      .map(({ error }) => Error.fromJson(error))
      .catch((_error) => Observable.of(null));
  }

  public delete(id: number): Observable<Project> {
    return this
      .http
      .delete<any>(`${environment.apiUrl}/api/projects/${id}`)
      .map(({ success }: any) => success)
      .catch((err) => Observable.of(err.status));
  }
}
