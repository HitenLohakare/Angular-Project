import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInfoService {

  	private static KEY_AUTH_TOKEN = 'token';
  	private _tokenSubject: BehaviorSubject<string | null>;

  constructor() {
		this._tokenSubject = new BehaviorSubject(this._getAuthToken());
	}

  private _getAuthToken(): string | null {
		return localStorage.getItem(AuthInfoService.KEY_AUTH_TOKEN);
	}

	setAuthToken(token: string | null) {
		this._tokenSubject.next(token);

     token 
     ? localStorage.setItem(AuthInfoService.KEY_AUTH_TOKEN, token)
      : localStorage.removeItem(AuthInfoService.KEY_AUTH_TOKEN);   
  }

  public get tokenSubject(): BehaviorSubject<string | null> {
		return this._tokenSubject;
	}
}
