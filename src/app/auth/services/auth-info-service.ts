import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../../shared/model/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthInfoService {
  
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:4444';
  private readonly TOKEN_KEY = 'auth_token';

  //BehaviorSubject holds the current token value for the interceptor
  public tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.TOKEN_KEY));

  //--- Token Management Methods ---

  /**
   * Saves the token to LocalStorage and updates the stream
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  /**
   * Retrieves the token directly from the Subject or LocalStorage
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Clears the token from LocalStorage and notifies subscribers
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
  }

  // --- Existing Methods ---
  login(body: { mobileNumber: string; password: string }) {
    const params = new HttpParams()
      .set('mobileNumber', body.mobileNumber)
      .set('password', body.password);

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/admin-panel/login`,
      null, 
      { params }
    );
  }

  verifyTwoFactor(secret: string, code: string, loginCipher: string | null) {
    let params = new HttpParams()
      .set('secretKey', secret)
      .set('code', code);

    if (loginCipher) {
      params = params.set('cipher', loginCipher);
    }

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/admin-panel/2fa`,
      null,
      { params }
    );
  }

  loginTwoFactor(otpCode: string, loginCipher: string) {
    const params = new HttpParams()
      .set('code', otpCode)
      .set("cipher", loginCipher);
      
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/admin-panel/2fa`,
      null,
      { params }
    );
  }

  changePassword(passwords: any) {
    const params = new HttpParams()
      .set('oldPassword', passwords.oldPassword)
      .set('newPassword', passwords.newPassword)
      .set('newPasswordConfirm', passwords.confirmPassword);

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/restapi/admin-panel/changePassword`, 
      null, 
      { params }
    );
  }
}