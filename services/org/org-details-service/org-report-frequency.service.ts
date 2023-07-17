/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgReportFrequency } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgReportFrequency>;

@Injectable()
export class OrgReportFrequencyService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-report-frequencies';

  constructor(private http: HttpClient) {}

  create(orgReportFrequency: OrgReportFrequency): Observable<EntityResponseType> {
    const copy = this.convert(orgReportFrequency);
    return this.http
      .post<OrgReportFrequency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(orgReportFrequency: OrgReportFrequency): Observable<EntityResponseType> {
    const copy = this.convert(orgReportFrequency);
    return this.http
      .put<OrgReportFrequency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgReportFrequency>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgReportFrequency[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgReportFrequency[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgReportFrequency[]>) => this.convertArrayResponse(res)));
  }

  search(orgId: number, searchBy: any, req?: any): Observable<HttpResponse<OrgReportFrequency[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgReportFrequency[]>(`${this.resourceUrl}/read?reportTypeName=${searchBy.name}&orgId=${orgId}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<OrgReportFrequency[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgReportFrequency = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgReportFrequency[]>): HttpResponse<OrgReportFrequency[]> {
    const jsonResponse: OrgReportFrequency[] = res.body!;
    const body: OrgReportFrequency[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to OrgReportFrequency.
   */
  private convertItemFromServer(orgReportFrequency: OrgReportFrequency): OrgReportFrequency {
    const copy: OrgReportFrequency = Object.assign({}, orgReportFrequency);
    return copy;
  }

  /**
   * Convert a OrgReportFrequency to a JSON which can be sent to the server.
   */
  private convert(orgReportFrequency: OrgReportFrequency): OrgReportFrequency {
    const copy: OrgReportFrequency = Object.assign({}, orgReportFrequency);
    return copy;
  }
}
