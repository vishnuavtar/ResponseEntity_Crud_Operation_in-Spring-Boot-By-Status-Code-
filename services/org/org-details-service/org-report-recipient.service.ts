/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgReportRecipient } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgReportRecipient>;

@Injectable()
export class OrgReportRecipientService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-report-recipients';

  constructor(private http: HttpClient) {}

  create(orgReportRecipient: OrgReportRecipient): Observable<EntityResponseType> {
    const copy = this.convert(orgReportRecipient);
    return this.http
      .post<OrgReportRecipient>(`${this.resourceUrl}/create`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(orgReportRecipient: OrgReportRecipient): Observable<EntityResponseType> {
    const copy = this.convert(orgReportRecipient);
    return this.http
      .put<OrgReportRecipient>(`${this.resourceUrl}/update`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgReportRecipient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgReportRecipient[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgReportRecipient[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgReportRecipient[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findEmailTemplate(reportTypeId: number, subTypeId: number, orgId: number) {
    // tslint:disable-next-line: max-line-length
    return this.http
      .get<any>(
        SERVER_API_URL +
          `org/api/org-report-email-templates/find?orgId=${orgId}&reportTypeId=${reportTypeId}&subTypeId=${subTypeId}&typeOfReport=File`,
        { observe: 'response' }
      )
      .pipe(map(res => res));
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgReportRecipient = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgReportRecipient[]>): HttpResponse<OrgReportRecipient[]> {
    const jsonResponse: OrgReportRecipient[] = res.body!;
    const body: OrgReportRecipient[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to OrgReportRecipient.
   */
  private convertItemFromServer(orgReportRecipient: OrgReportRecipient): OrgReportRecipient {
    const copy: OrgReportRecipient = Object.assign({}, orgReportRecipient);
    return copy;
  }

  /**
   * Convert a OrgReportRecipient to a JSON which can be sent to the server.
   */
  private convert(orgReportRecipient: OrgReportRecipient): OrgReportRecipient {
    const copy: OrgReportRecipient = Object.assign({}, orgReportRecipient);
    return copy;
  }
}
