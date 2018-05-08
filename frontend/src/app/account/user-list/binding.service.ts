import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class BindingService {

  constructor(
    private http: HttpClient
  ) { }

  public bind(userId: number, bindingIds: number[]): Observable<any[]> {
    const params = new HttpParams()
    .set('project_ids', bindingIds.join(','));

    return this
      .http
      .get<any>(`${environment.apiUrl}/api/users/${userId}/bind`, {params: params})
      .map(({ ids }) => ids || [])
      .catch((_error) => Observable.of(null));
  }

  public unbind(userId: number, unbindingIds: number[]): Observable<any[]> {
    const params = new HttpParams()
    .set('project_ids', unbindingIds.join(','));

    return this
      .http
      .get<any>(`${environment.apiUrl}/api/users/${userId}/unbind`, {params: params})
      .map(({ ids }) => ids || [])
      .catch((_error) => Observable.of(null));
  }
}
