import '@app/shared/rxjs-operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project, ProjectWithUsers } from '@app/core/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectService {

  constructor(
    private http: HttpClient
  ) { }

  public list(substring: string, preloadUsers: boolean,
              onlyOwnership: boolean): Observable<Project[] | ProjectWithUsers[]> {
    const params: HttpParams = new HttpParams()
      .set('substring', substring || '')
      .set('users', preloadUsers ? 'true' : '')
      .set('ownership', onlyOwnership ? 'true' : '');

    return this
      .http
      .get<any>(`${environment.apiUrl}/api/projects`, { params })
      .map(({ projects }: any) => projects.map((project) =>
        preloadUsers ? ProjectWithUsers.fromJson(project) : Project.fromJson(project)));
  }

  public get(id: number): Observable<ProjectWithUsers> {
    return this
      .http
      .get<any>(`${environment.apiUrl}/api/projects/${id}`)
      .map(({ project }: any) => ProjectWithUsers.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }

  public create(name: string): Observable<Project> {
    const params = {
      project: { name }
    };

    return this
      .http
      .post<any>(`${environment.apiUrl}/api/projects`, params)
      .map(({ project }: any) => Project.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }

  public archive(id: number): Observable<Project> {
    return this
      .http
      .get<any>(`${environment.apiUrl}/api/projects/${id}/archive`)
      .map(({ project }: any) => Project.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }

  public unarchive(id: number): Observable<Project> {
    return this
      .http
      .get<any>(`${environment.apiUrl}/api/projects/${id}/unarchive`)
      .map(({ project }: any) => Project.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }

  public update(id: number, projectParams: any): Observable<Project> {
    const params = {
      project: {
        name: projectParams.name
      }
    };

    return this
      .http
      .put<any>(`${environment.apiUrl}/api/projects/${id}`, params)
      .map(({ project }) => Project.fromJson(project))
      .catch((_error) => Observable.of(null));
  }

  public delete(id: number): Observable<Project> {
    return this
      .http
      .delete<any>(`${environment.apiUrl}/api/projects/${id}`)
      .map(({ project }: any) => Project.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }
}
