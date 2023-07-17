/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { createRequestOption } from '../../shared';
import { OrgReportConfig } from '../models';

export type EntityResponseType = HttpResponse<OrgReportConfig>;

@Injectable()
export class OrgReportConfigService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-report-configs';

  constructor(private http: HttpClient) {}

  create(orgReportConfig: OrgReportConfig): Observable<EntityResponseType> {
    const copy = this.convert(orgReportConfig);
    return this.http
      .post<OrgReportConfig>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  getAlertsConfig(orgId: any) {
    const url = `${SERVER_API_URL}/core/api/v1/alerts-config/${orgId}/id`;
    return this.http.get(url, { observe: 'response' });
    // .pipe(map((res: EntityResponseType) => this.convertArrayResponse(res)));
  }

  postAlertsConfig(reqObj: any) {
    const url = `${SERVER_API_URL}/core/api/v1/alerts-config/`;
    return this.http.post(url, reqObj, { observe: 'response' });
    // .pipe(map((res: EntityResponseType) => this.convertArrayResponse(res)));
  }

  update(orgReportConfig: OrgReportConfig): Observable<EntityResponseType> {
    const copy = this.convert(orgReportConfig);
    return this.http
      .put<OrgReportConfig>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgReportConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgReportConfig[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgReportConfig[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgReportConfig[]>) => this.convertArrayResponse(res)));
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgReportConfig = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgReportConfig[]>): HttpResponse<OrgReportConfig[]> {
    const jsonResponse: OrgReportConfig[] = res.body!;
    const body: OrgReportConfig[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  private convertItemFromServer(orgReportConfig: OrgReportConfig): OrgReportConfig {
    const copy: OrgReportConfig = Object.assign({}, orgReportConfig);
    return copy;
  }

  private convert(orgReportConfig: OrgReportConfig): OrgReportConfig {
    const copy: OrgReportConfig = Object.assign({}, orgReportConfig);
    return copy;
  }
}
