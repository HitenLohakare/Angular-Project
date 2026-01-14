import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthInfoService {

  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:4444';

  login(body: { mobileNumber: string; password: string }): Observable<ApiResponse> {
    
    const params = new HttpParams()
      .set('mobileNumber', body.mobileNumber)
      .set('password', body.password);

    return this.http.post<ApiResponse>(
      `${this.baseUrl}/admin-panel/login`,
      null, 
      { params }
    );
  }
}