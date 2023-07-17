/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgUser } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgUser>;

@Injectable()
export class OrgUserService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-users';

  constructor(private http: HttpClient) {}

  create(orgUser: OrgUser): Observable<EntityResponseType> {
    const copy = this.convert(orgUser);
    // copy.orgId = orgUser.org.id;
    // copy.roleId = orgUser.role.id;
    return this.http
      .post<OrgUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(orgUser: OrgUser): Observable<EntityResponseType> {
    const copy = this.convert(orgUser);
    // copy.orgId = orgUser.org.id;
    // copy.roleId = orgUser.role.id;
    return this.http
      .put<OrgUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgUser[]>> {
    const pageReq = { ...req };
    // if (pageReq && Object.keys(pageReq).length) {
    //   pageReq.size = 50;
    // }
    const options = createRequestOption(pageReq);
    return this.http
      .get<OrgUser[]>(`${this.resourceUrl}/read?orgId=${orgId}&value=${req.searchValue}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgUser[]>) => this.convertArrayResponse(res)));
  }

  list(orgId: number): Observable<HttpResponse<OrgUser[]>> {
    return this.http
      .get<OrgUser[]>(`${this.resourceUrl}/analyst`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgUser[]>) => this.convertArrayResponse(res)));
  }

  rootOrgAnalyst(): Observable<HttpResponse<OrgUser[]>> {
    return this.http
      .get<OrgUser[]>(`${this.resourceUrl}/rootorganalyst`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgUser[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(orgId: number, searchBy: any): Observable<HttpResponse<OrgUser[]>> {
    return this.http
      .get<OrgUser[]>(`${this.resourceUrl}/search?all=${searchBy.firstname}&orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgUser[]>) => this.convertArrayResponse(res)));
  }

  // get current org-user info
  getLoggedUserInfo(emailId: any): Observable<EntityResponseType> {
    const stc: any = { '+': '%2B', '#': '%23' };
    emailId = emailId.replace(/[+#]/gi, function (m: string) {
      return stc[m];
    });
    return this.http
      .get<OrgUser>(`${this.resourceUrl}/loginId?loginId=${emailId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  eulaUserHistory(orgUser: OrgUser): Observable<EntityResponseType> {
    const copy = this.convert(orgUser);
    return this.http
      .post<OrgUser>(SERVER_API_URL + 'org/api/eula-user-histories', copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgUser = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgUser[]>): HttpResponse<OrgUser[]> {
    const jsonResponse: OrgUser[] = res.body!;
    const body: OrgUser[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to OrgUser.
   */
  private convertItemFromServer(orgUser: OrgUser): OrgUser {
    const copy: OrgUser = Object.assign({}, orgUser);
    return copy;
  }

  /**
   * Convert a OrgUser to a JSON which can be sent to the server.
   */
  private convert(orgUser: OrgUser): OrgUser {
    const copy: OrgUser = Object.assign({}, orgUser);
    return copy;
  }
}
