import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

 getRequest<T>(
  url: string,
  data?: Record<string, string | number | boolean>
): Observable<T> {
  return this.http.get<T>(url, {
    params: data
  });
}

  postRequest<T>(
    url: string,
    data: any
  ): Observable<T> {
    return this.http.post<T>(url, data);
  }

  putRequest<T>(
    url: string,
    data: any
  ): Observable<T> {
    return this.http.put<T>(url, data);
  }

  deleteRequest<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
