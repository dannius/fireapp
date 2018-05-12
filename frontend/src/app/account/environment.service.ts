import '@app/shared/rxjs-operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@app/core/models/environment';
import { environment as env } from '@env/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EnvironmentService {

  constructor(
    private http: HttpClient
  ) { }

  public create(envParams: any): Observable<Environment> {
    const params = {
      environment: {
        name: envParams.name,
        project_id: envParams.projectId
      }
    };

    return this
      .http
      .post<any>(`${env.apiUrl}/api/environments`, params)
      .map(({ environment }) => Environment.fromJson(environment))
      .catch((_error) => Observable.of(null));
  }

  public update(id: number, envParams: any): Observable<Environment> {
    const params = {
      environment: {
        name: envParams.name,
      }
    };

    return this
      .http
      .patch<any>(`${env.apiUrl}/api/environments/${id}`, params)
      .map(({ environment }) => Environment.fromJson(environment))
      .catch((_error) => Observable.of(null));
  }

  public delete(id: number): Observable<Environment> {
    return this
      .http
      .delete<any>(`${env.apiUrl}/api/environments/${id}`)
      .map(({ environment }) => Environment.fromJson(environment))
      .catch((_error) => Observable.of(null));
  }

}
