import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable()
export class DemoSdkService {

  private sdkKey: string;
  private environmentName: string;

  constructor(
    private http: HttpClient
  ) { }

  public setup(sdkKey, environmentName) {
    this.sdkKey = sdkKey;
    this.environmentName = environmentName;
  }

  public createError(name: string) {

    if (!this.sdkKey || ! this.environmentName) {
      return;
    }

    const errorParams = {
      name: name,
      environment_name: this.environmentName,
      sdk_key: this.sdkKey
    };

    return this.http
      .post<any>(`${environment.apiUrl}/api/errors`, { error: errorParams })
      .subscribe((res) => console.log(res));
  }

}
