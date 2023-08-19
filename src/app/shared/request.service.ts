import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../model/request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(private http: HttpClient) { }

  api: string = `http://localhost:8080/model1-service`

  sendRequest(request: Request): Observable<any> {
    return this.http.post<any>(this.api+"/train", request);
  }


  getComplex(): Observable<any> {
    return this.http.get<any>(this.api+`/complex`)
  }

}
