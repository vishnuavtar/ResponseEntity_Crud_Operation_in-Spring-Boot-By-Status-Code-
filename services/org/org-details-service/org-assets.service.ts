/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import { OrgAssets, OrgAssetsAudit } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgAssets>;

@Injectable()
export class OrgAssetsService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-assets';
  private resourceUrl2 = SERVER_API_URL + 'org/api/org-assets-audit';
  private resourceUrl3 = SERVER_API_URL + 'org/api';

  constructor(private http: HttpClient) {}

  validateCpe(orgId: number, cpe: string): Observable<HttpResponse<any>> {
    // return this.http.get(`https://services.nvd.nist.gov/rest/json/cpes/1.0/?cpeMatchString=${cpe}`, { observe: 'response' });
    return this.http.get(`${this.resourceUrl}/validate-cpe?orgId=${orgId}&cpeMatchString=${cpe}`, { observe: 'response' });
  }

  create(orgAssets: OrgAssets): Observable<EntityResponseType> {
    const copy = this.convert(orgAssets);
    // copy.orgId = orgAssets.org.id;
    return this.http
      .post<OrgAssets>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(orgAssets: OrgAssets): Observable<EntityResponseType> {
    const copy = this.convert(orgAssets);
    // copy.orgId = orgAssets.org.id;
    return this.http
      .put<OrgAssets>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgAssets>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgAssets[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAssets[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAssets[]>) => this.convertArrayResponse(res)));
  }

  queryAssetAudit(orgId: number, req?: any): Observable<HttpResponse<OrgAssetsAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAssetsAudit[]>(`${this.resourceUrl2}/assetaudit?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAssetsAudit[]>) => this.convertArrayResponse(res)));
  }
  searchqueryAssetAudit(orgId: number, req?: any, searchBy?: any): Observable<HttpResponse<OrgAssetsAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAssetsAudit[]>(
        `${this.resourceUrl2}/search?orgId=${orgId}&assetName=${searchBy.assetName}&action=${searchBy.action}&monitor=${searchBy.monitor}`,
        { params: options, observe: 'response' }
      )
      .pipe(map((res: HttpResponse<OrgAssetsAudit[]>) => this.convertArrayResponse(res)));
  }

  queryAccessLog(req?: any, orgId?: number, searchBy?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any>(`${this.resourceUrl3}/orgs/accesslogs?orgId=${orgId}&fromDate=${searchBy.fromDate}&toDate=${searchBy.toDate}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
  }

  downloadAccessLog(orgId: number, searchBy?: any) {
    return this.http.get(
      `${this.resourceUrl3}/orgs/accesslogs/download?orgId=${orgId}&fromDate=${searchBy.fromDate}&toDate=${searchBy.toDate}`,
      { responseType: 'blob' }
    );
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  deleteAll(monitor?: number, orgId?: number, ids?: number[]): Observable<HttpResponse<any>> {
    if (ids!.length > 0) {
      monitor = 0;
      // orgId = 0;
    }
    return this.http.delete<any>(`${this.resourceUrl}/deleteInBatch?orgId=${orgId}&monitor=${monitor}&ids=${ids}`, { observe: 'response' });
  }

  getFile(monitor: number) {
    // url =this.resourceUrl+'/download';
    return this.http.get(`${this.resourceUrl}/csvtemplatedownload?monitor=${monitor}`, { responseType: 'text' });
  }

  search(orgId: number, searchBy: any): Observable<HttpResponse<OrgAssets[]>> {
    return this.http
      .get<OrgAssets[]>(`${this.resourceUrl}/search?assetname=${searchBy.name}&orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAssets[]>) => this.convertArrayResponse(res)));
  }

  uploadFile(orgId: any, formData: any, monitor: number): Observable<HttpResponse<any>> {
    return this.http.post(SERVER_API_URL + 'org/api/org-assets/upload?' + `orgId=${orgId}&monitor=${monitor}`, formData, {
      observe: 'response',
    });
  }

  getAssets(orgId: number, monitor: number): Observable<HttpResponse<OrgAssets[]>> {
    return this.http
      .get<OrgAssets[]>(`${this.resourceUrl}/read?orgId=${orgId}&monitor=${monitor}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAssets[]>) => this.convertArrayResponse(res)));
  }

  validateCsv(formData: FormData): Observable<HttpResponse<any>> {
    return this.http
      .post(`${this.resourceUrl}/validate`, formData, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  digitalRiskKeywordDownload(orgId: number, monitor: number) {
    return this.http.get(`${this.resourceUrl}/digitalRiskKeywordDownload?orgId=${orgId}&monitor=${monitor}`, { responseType: 'blob' });
  }

  orgAssetCsvDownload(orgId: number, monitor: number, assetType: any) {
    return this.http.get(`${this.resourceUrl}/org-asset-download?orgId=${orgId}&monitor=${monitor}&assetType=${assetType}`, {
      responseType: 'blob',
    });
  }
  createThirdPartyDomain(req: any): Observable<HttpResponse<any>> {
    if (req.id) {
      return this.http
        .put(`${this.resourceUrl}/third-party-domain`, req, { observe: 'response' })
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    } else {
      return this.http
        .post(`${this.resourceUrl}/third-party-domain`, req, { observe: 'response' })
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }
  }
  getThirdPartyDomain(orgId: number, pageReq?: any): Observable<HttpResponse<any[]>> {
    return this.http
      .get<any[]>(`${this.resourceUrl}/third-party-domain?orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertArrayResponse(res)));
  }
  deleteThirdPartyDomain(id: number): Observable<HttpResponse<any[]>> {
    return this.http.delete<any>(`${this.resourceUrl}/third-party-domain/${id}`, { observe: 'response' });
  }
  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgAssets = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgAssets[]>): HttpResponse<OrgAssets[]> {
    const jsonResponse: OrgAssets[] = res.body!;
    const body: OrgAssets[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to OrgAssets.
   */
  private convertItemFromServer(orgAssets: OrgAssets): OrgAssets {
    const copy: OrgAssets = Object.assign({}, orgAssets);
    return copy;
  }

  /**
   * Convert a OrgAssets to a JSON which can be sent to the server.
   */
  private convert(orgAssets: OrgAssets): OrgAssets {
    const copy: OrgAssets = Object.assign({}, orgAssets);
    return copy;
  }
  getAssetsWithcomment(orgId: number, monitor: number, req?: any, assetType?: any): Observable<HttpResponse<OrgAssets[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAssets[]>(`${this.resourceUrl}/read?orgId=${orgId}&monitor=${monitor}&assetType=${assetType}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<OrgAssets[]>) => this.convertArrayResponse(res)));
  }
}
