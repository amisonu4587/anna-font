import { Injectable, Service } from '@angular/core';
import { HttpService } from '../../../../sheared/services/http-service';
import { Observable } from 'rxjs';
import { constants } from '../../../../sheared/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
   constructor(private httpser:HttpService) { }

     verificationEmailLink(id:string):Observable<any>{
       return this.httpser.getRequest(constants.backendUrl+constants.apiEndPiont.verifyInitialApplication+'/'+id);
     }
}
