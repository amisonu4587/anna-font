import { Injectable, Service } from '@angular/core';
import { HttpService } from '../../../sheared/services/http-service';
import { Observable } from 'rxjs';
import { constants } from '../../../sheared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpser:HttpService) { }


  loginSubmit(data:any):Observable<any>{
    return this.httpser.postRequest(constants.backendUrl+constants.apiEndPiont.adminLogin,data);
  }

  getToken(){
    return localStorage.getItem('token');
  }

}
