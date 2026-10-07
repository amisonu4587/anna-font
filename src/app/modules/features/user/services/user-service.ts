import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../../../sheared/constant/constant';
import { HttpService } from '../../../sheared/services/http-service';

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


  

}
