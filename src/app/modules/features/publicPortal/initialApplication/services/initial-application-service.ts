import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../sheared/services/http-service';
import { constants } from '../../../../sheared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class InitialApplicationService {
  constructor(private httpser:HttpService) { }

      getApplicationFor():Observable<any>{
        return this.httpser.getRequest(constants.backendUrl+constants.apiEndPiont.applicationFor);
      }


      submitInitialApplication(data:any):Observable<any>{
        return this.httpser.postRequest(constants.backendUrl+constants.apiEndPiont.createInitialApplication,data);
      }

}
