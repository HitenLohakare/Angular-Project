import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, timeout } from 'rxjs';
import { AuthInfoService } from '../../../auth/services/auth-info-service';
import { ApiResponse } from '../apiresponse';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);
  const authInfoService = inject(AuthInfoService);
  const requestTimeout = 1000 * 60 * 2;

  //Get current token value (Assuming your service has a way to get current value)
  const token = authInfoService.tokenSubject.value; 

  // 1. Error Handler Logic
  const errorHandler = (error: HttpErrorResponse) => {
    let errorMessage = "";
    const errorCode = error.status;

    if (error.error instanceof Error) {
      errorMessage = error.error.message;
    } else {
      if (errorCode === 401 || errorCode === 403) {
        errorMessage = "Looks like your account is disabled or you are not authenticated. Please logout and login again.";
      } else if (errorCode >= 400 && errorCode <= 499) {
        errorMessage = "Something went wrong while communicating with server. Please try again later.";
      } else if (errorCode === 500) {
        router.navigate(['/server-error']);
      } else {
        errorMessage = "Something went wrong while communicating with server. Please try again later.";
      }
    }

    const apiResponse: ApiResponse = {
      success: false,
      error: {
        code: `${errorCode}`,
        message: errorMessage
      }
    };

    return of(new HttpResponse({
      body: [{ name: JSON.stringify(apiResponse) }],
      status: 200
    }));
  };

  //2. Intercept Logic
  let activeRequest = req;

  if (req.url.includes("restapi") && token !== null) {
    activeRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(activeRequest).pipe(
    timeout(requestTimeout),
    catchError(errorHandler)
  );
};