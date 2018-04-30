import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

  private readonly TOKEN = 'token';

  private _token: string = null;

  public get token(): string {
    if (this._token) {
      return this._token;
    } else {
      this._token = this.fetch();
      return this._token;
    }
  }

  public fetch(): string {
    return localStorage.getItem(this.TOKEN);
  }

  public write(token: string) {
    localStorage.setItem(this.TOKEN, token);
    this._token = token;
  }

  public clear() {
    localStorage.setItem(this.TOKEN, null);
  }

}
