import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../../shared/model/apiresponse';
import { User } from '../../shared/model/user';

@Injectable({
    providedIn: 'root'
})
export class AuthInfoService {

    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:4444';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly CIPHER_KEY = 'login_cipher';
    private readonly USER_STORAGE_KEY = 'loggedInUser';

    //BehaviorSubject holds the current values for the interceptor and UI
    public tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.TOKEN_KEY));
    public cipherSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.CIPHER_KEY));
    public userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

    setCipher(cipher: string): void {
        localStorage.setItem(this.CIPHER_KEY, cipher);
        this.cipherSubject.next(cipher);
    }

    getCipher(): string | null {
        return this.cipherSubject.value;
    }
 
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.tokenSubject.next(token);
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.tokenSubject.next(null);
    }

    logOut(): void {
        this.removeToken();
        this.removeUser();
        localStorage.clear();
    }

    private getUserFromStorage(): User | null {
        const user = localStorage.getItem(this.USER_STORAGE_KEY);
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {
                console.error("Could not parse user from local storage", e);
                return null;
            }
        }
        return null;
    }

    setUser(user: User | null): void {
        if (user == null) {
            this.removeUser();
        } else {
            localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
            this.userSubject.next(user);
        }
    }

    getUser(): User | null {
        return this.userSubject.value;
    }

    removeUser(): void {
        localStorage.removeItem(this.USER_STORAGE_KEY);
        this.userSubject.next(null);
    }

    login(body: { mobileNumber: string; password: string }): Observable<ApiResponse> {
        const params = new HttpParams()
            .set('mobileNumber', body.mobileNumber)
            .set('password', body.password);

        return this.http.post<ApiResponse>(
            `${this.baseUrl}/admin/login`,
            null,
            { params }
        );
    }

    verifyTwoFactor(secretKey: string | null, code: string, cipher: string): Observable<ApiResponse> {
        let params = new HttpParams()
            .set('cipher', cipher)
            .set('code', code);

        if (secretKey) {
            params = params.set('secretKey', secretKey);
        }
        return this.http.post<ApiResponse>(
            `${this.baseUrl}/admin/2fa`,
            null,
            { params }
        );
    }

    changePassword(passwords: any): Observable<ApiResponse> {
        const params = new HttpParams()
            .set('oldPassword', passwords.oldPassword)
            .set('newPassword', passwords.newPassword)
            .set('newPasswordConfirm', passwords.confirmPassword);

        return this.http.post<ApiResponse>(
            `${this.baseUrl}/restapi/admin/changePassword`,
            null,
            { params }
        );
    }

    forgetPassword(mobileNumber: string) {
        const params = new HttpParams()
            .set('mobileNumber', mobileNumber);

        return this.http.post<ApiResponse>(
            `${this.baseUrl}/admin/forgotPassword`,
            null,
            { params }
        );
    }

    resetPassword(passwords: any, token: string) {
        const params = new HttpParams()
            .set('newPassword', passwords.newPassword)
            .set('confirmPassword', passwords.confirmPassword)
            .set('token', token);

        return this.http.post<ApiResponse>(
            `${this.baseUrl}/admin/resetPassword`,
            null,
            { params }
        );
    }
}