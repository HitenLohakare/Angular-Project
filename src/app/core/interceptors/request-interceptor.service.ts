import { Injectable } from '@angular/core';
import { AuthInfoService } from '../services/auth-info.service';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { ApiResponse } from '../models/apiresponse';
import { catchError, Observable, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RequestInterceptorService implements HttpInterceptor {

  private _token: string | null = null;
  requestTimeout = 1000 * 60 * 2;

  constructor(authInfoService: AuthInfoService, private router: Router) {
   authInfoService.tokenSubject.subscribe(token => this._token = token);
  }

  private errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    const code = error.status;

    if (error.error instanceof Error) {
      errorMessage = error.error.message;
    } else if (code === 401 || code === 403) {
      errorMessage = 'Your account is disabled or not authenticated. Please logout and login again.';
    } else if (code >= 400 && code < 500) {
      errorMessage = 'Something went wrong while communicating with server. Please try again later.';
    } else if (code === 500) {
      this.router.navigate(['/server-error']);
    } else {
      errorMessage = 'Something went wrong while communicating with server. Please try again later.';
    }

    const apiResponse = new ApiResponse();
    apiResponse.success = false;
    apiResponse.error['code'] = `${code}`;
    apiResponse.error['message'] = errorMessage;

    return of(new HttpResponse({ body: [{ name: JSON.stringify(apiResponse) }], status: 200 }));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq = req;

    if (!req.url.startsWith('http')) {
      modifiedReq = modifiedReq.clone({ url: `${environment.baseUrl}${req.url}` });
    }

    if (this._token && req.url.includes('restapi')) {
      modifiedReq = modifiedReq.clone({
        headers: modifiedReq.headers.set('Authorization', `Bearer ${this._token}`)
      });
    }
    
    return next.handle(modifiedReq).pipe(
      timeout(this.requestTimeout),
      catchError(this.errorHandler)
    );
  }
}
