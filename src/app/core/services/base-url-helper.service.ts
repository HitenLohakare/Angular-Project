import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlHelperService {

  baseUrl : String = environment.baseUrl;

  constructor(){
    
  }
  
}
