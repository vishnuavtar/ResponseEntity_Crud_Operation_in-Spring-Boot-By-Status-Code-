/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgSubscription } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgSubscription>;

@Injectable()
export class OrgSubscriptionService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-subscriptions';

  constructor(private http: HttpClient) {}

  create(orgSubscription: OrgSubscription): Observable<EntityResponseType> {
    const copy = this.convert(orgSubscription);
    return this.http
      .post<OrgSubscription>(`${this.resourceUrl}/create`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  subscribeModule(orgSubscription: OrgSubscription): Observable<EntityResponseType> {
    const copy = this.convert(orgSubscription);
    return this.http
      .post<OrgSubscription>(`${this.resourceUrl}/subscribe`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number): Observable<HttpResponse<OrgSubscription[]>> {
    const options = createRequestOption();
    return this.http
      .get<OrgSubscription[]>(`${this.resourceUrl}/findByOrgIdAndStatus?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgSubscription[]>) => this.convertArrayResponse(res)));
  }
  // get active package details
  getActivePackageDetails(orgId: number): Observable<EntityResponseType> {
    return this.http
      .get<any>(`${SERVER_API_URL}/org/api/licence-model?orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgSubscription = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgSubscription[]>): HttpResponse<OrgSubscription[]> {
    const jsonResponse: OrgSubscription[] = res.body!;
    const body: OrgSubscription[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  private convertItemFromServer(orgSubscription: OrgSubscription): OrgSubscription {
    const copy: OrgSubscription = Object.assign({}, orgSubscription);
    return copy;
  }

  private convert(orgSubscription: OrgSubscription): OrgSubscription {
    const copy: OrgSubscription = Object.assign({}, orgSubscription);
    return copy;
  }
}
