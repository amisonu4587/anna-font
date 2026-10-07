import { Injectable, Service } from '@angular/core';
import { HttpService } from '../../services/http-service';
import { Observable } from 'rxjs';
import { constants } from '../../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

    constructor(private httpser:HttpService) { }

      logout():Observable<any>{
        return this.httpser.getRequest(constants.backendUrl+constants.apiEndPiont.adminLogout);
      }

}
