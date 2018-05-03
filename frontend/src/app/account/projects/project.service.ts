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

  public filter(substring: string): Observable<ProjectWithUsers[]> {
    const params: HttpParams = new HttpParams()
      .set('substring', substring);

    return this
      .http
      .get<any>(`${environment.apiUrl}/api/projects`, { params })
      .map(({ projects }: any) => projects.map((project) => ProjectWithUsers.fromJson(project)));
  }

  public create(name: string): Observable<Project> {
    const params = {
      project: { name }
    };

    return this
      .http
      .post<Project>(`${environment.apiUrl}/api/projects`, params)
      .map(({ project }: any) => Project.fromJson(project))
      .catch((err) => Observable.of(err.status));
  }
}
