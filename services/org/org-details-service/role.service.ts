/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { Role } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Role>;

@Injectable()
export class RoleService {
  private resourceUrl = SERVER_API_URL + 'org/api/roles';

  constructor(private http: HttpClient) {}

  create(role: Role): Observable<EntityResponseType> {
    const copy = this.convert(role);
    return this.http
      .post<Role>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(role: Role): Observable<EntityResponseType> {
    const copy = this.convert(role);
    return this.http
      .put<Role>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Role>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<Role[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Role[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Role[]>) => this.convertArrayResponse(res)));
  }

  getRoles(req?: any): Observable<HttpResponse<Role[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Role[]>(`${this.resourceUrl}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Role[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: Role = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<Role[]>): HttpResponse<Role[]> {
    const jsonResponse: Role[] = res.body!;
    const body: Role[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to Role.
   */
  private convertItemFromServer(role: Role): Role {
    const copy: Role = Object.assign({}, role);
    return copy;
  }

  /**
   * Convert a Role to a JSON which can be sent to the server.
   */
  private convert(role: Role): Role {
    const copy: Role = Object.assign({}, role);
    return copy;
  }
}
