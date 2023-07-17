/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgAssetsTemp } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgAssetsTemp>;

@Injectable()
export class OrgAssetsTempService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-assets-temps';

  constructor(private http: HttpClient) {}

  query(orgId: number, req?: any): Observable<HttpResponse<OrgAssetsTemp[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAssetsTemp[]>(`${this.resourceUrl}?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAssetsTemp[]>) => this.convertArrayResponse(res)));
  }

  copy(ids: any[]): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.resourceUrl}/copy`, ids, { observe: 'response' });
  }

  delete(ids: any[]): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: ids,
    };
    return this.http.delete<any>(`${this.resourceUrl}/delete`, httpOptions);
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgAssetsTemp = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgAssetsTemp[]>): HttpResponse<OrgAssetsTemp[]> {
    const jsonResponse: OrgAssetsTemp[] = res.body!;
    const body: OrgAssetsTemp[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  private convertItemFromServer(orgAssets: OrgAssetsTemp): OrgAssetsTemp {
    const copy: OrgAssetsTemp = Object.assign({}, orgAssets);
    return copy;
  }
}
