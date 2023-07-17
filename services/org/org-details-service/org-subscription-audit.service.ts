/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgSubscriptionAudit } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgSubscriptionAudit>;
@Injectable()
export class OrgSubscriptionAuditService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-subscriptions-audits';
  private resourceUrl1 = SERVER_API_URL + 'org/api/org-subscriptions-audits/search';

  constructor(private http: HttpClient) {}

  searchquerySubscriptionAudit(orgId: number, req?: any, searchBy?: any): Observable<HttpResponse<OrgSubscriptionAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgSubscriptionAudit[]>(`${this.resourceUrl}/?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgSubscriptionAudit[]>) => this.convertArrayResponse(res)));
  }
  searchqueryAuditSub(orgId: number, req?: any, searchBy?: any): Observable<HttpResponse<OrgSubscriptionAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgSubscriptionAudit[]>(`${this.resourceUrl1}/?orgId=${orgId}&action=${searchBy.action}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<OrgSubscriptionAudit[]>) => this.convertArrayResponse(res)));
  }
  private convertItemFromServer(orgSubscriptionAudit: OrgSubscriptionAudit): OrgSubscriptionAudit {
    const copy: OrgSubscriptionAudit = Object.assign({}, orgSubscriptionAudit);
    return copy;
  }
  private convertArrayResponse(res: HttpResponse<OrgSubscriptionAudit[]>): HttpResponse<OrgSubscriptionAudit[]> {
    const jsonResponse: OrgSubscriptionAudit[] = res.body!;
    const body: OrgSubscriptionAudit[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }
}
