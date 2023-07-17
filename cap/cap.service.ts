/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';

@Injectable()
export class CapService {
  private baseUrl = SERVER_API_URL + '/api/';
  constructor(private http: HttpClient) {}

  getCSPToken(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'csp-redirect', { observe: 'response' }).pipe(map((res: any) => this.convertResponse(res)));
  }

  private convertResponse(res: any): any {
    const body: any = this.convertItemFromServer(res.body);
    return res.clone({ body });
  }

  private convertItemFromServer(org: any): any {
    const copy: any = Object.assign({}, org);
    return copy;
  }
}
