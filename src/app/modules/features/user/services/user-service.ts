import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../../../sheared/constant/constant';
import { HttpService } from '../../../sheared/services/http-service';
import { ApiResponse, UserDetails } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

 constructor(private httpser:HttpService) { }


  getRole(includeSuperAdmin: boolean): Observable<any> {
    return this.httpser.getRequest(
      constants.backendUrl + constants.apiEndPiont.role,
      {
        includeSuperAdmin: includeSuperAdmin
      }
    );
  }

  userList(data:any):Observable<any>{
    return this.httpser.postRequest(constants.backendUrl+constants.apiEndPiont.userList,data);
  }

  upsertUser(data:any):Observable<any>{
    return this.httpser.postRequest(constants.backendUrl+constants.apiEndPiont.upsertUser,data);
  }

 singleUserData(data: any, id: number): Observable<ApiResponse<UserDetails>> {
  return this.httpser.getRequest(
    constants.backendUrl + constants.apiEndPiont.getSingleUserData + '/' + id,
    data
  );
}

userStatusChange(data: any, id: number): Observable<any> {
  return this.httpser.postRequest(constants.backendUrl + constants.apiEndPiont.userStatusChange + '/' + id + '?status=' + encodeURIComponent(data.status), {});
}




}
