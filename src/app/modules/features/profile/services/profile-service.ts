import { Injectable, Service } from '@angular/core';
import { HttpService } from '../../../sheared/services/http-service';
import { Observable } from 'rxjs';
import { constants } from '../../../sheared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

 constructor(private httpser:HttpService) { }


  getRole(includeSuperAdmin: boolean): Observable<any> {
    return this.httpser.getRequest(
      constants.backendUrl + constants.apiEndPiont.role,
      {
        includeSuperAdmin: includeSuperAdmin
      }
    );
  }

  singleUserData(data:any,id:number):Observable<any>{
    return this.httpser.getRequest(constants.backendUrl+constants.apiEndPiont.getSingleUserData+'/'+id,data);
  }




}
