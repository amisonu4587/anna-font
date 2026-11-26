import { Injectable, Service } from '@angular/core';
import { HttpService } from '../../../sheared/services/http-service';
import { Observable } from 'rxjs';
import { constants } from '../../../sheared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  constructor(private httpser:HttpService) { }

  submitForgotPassword(data:any):Observable<any>{
    return this.httpser.postRequest(constants.backendUrl+constants.apiEndPiont.forgotPassword,data);
  }
}
