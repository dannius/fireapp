import '@app/shared/rxjs-operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@app/core/models/environment';
import { environment as env } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { Error } from '@app/core/models/error';

@Injectable()
export class EnvironmentService {

  constructor(
    private http: HttpClient
  ) { }

  public list(envId: number, projectId: number): Observable<Error[]> {
    const params: HttpParams = new HttpParams()
    .set('environment_id', `${envId}` || '-1')
    .set('project_id', `${projectId}` || '-1');

    return this
      .http
      .get<any>(`${env.apiUrl}/api/environments`, { params })
      .map(({ errors }: any) => errors.map((error) => Error.fromJson(error)))
      .catch((err) => Observable.of(err.status));
  }

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

  public update(envParams: any): Observable<Environment> {
    const params = {
      environment: {
        name: envParams.name,
      }
    };

    return this
      .http
      .patch<any>(`${env.apiUrl}/api/environments/${envParams.id}`, params)
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
