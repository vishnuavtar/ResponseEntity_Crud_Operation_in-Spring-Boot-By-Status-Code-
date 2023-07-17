/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { Permission } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Permission>;

@Injectable()
export class PermissionService {
  private resourceUrl = SERVER_API_URL + 'org/api/permissions';

  constructor(private http: HttpClient) {}

  create(permission: Permission): Observable<EntityResponseType> {
    const copy = this.convert(permission);
    return this.http
      .post<Permission>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(permission: Permission): Observable<EntityResponseType> {
    const copy = this.convert(permission);
    return this.http
      .put<Permission>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Permission>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(req?: any): Observable<HttpResponse<Permission[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Permission[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Permission[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: Permission = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<Permission[]>): HttpResponse<Permission[]> {
    const jsonResponse: Permission[] = res.body!;
    const body: Permission[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to Permission.
   */
  private convertItemFromServer(permission: Permission): Permission {
    const copy: Permission = Object.assign({}, permission);
    return copy;
  }

  /**
   * Convert a Permission to a JSON which can be sent to the server.
   */
  private convert(permission: Permission): Permission {
    const copy: Permission = Object.assign({}, permission);
    return copy;
  }
}
