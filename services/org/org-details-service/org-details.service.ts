/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from '../../app.constants';

import { OrgDetails } from '../models';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrgDetails>;

@Injectable()
export class OrgDetailsService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-details';

  constructor(private http: HttpClient) {}

  create(orgDetails: OrgDetails): Observable<EntityResponseType> {
    const copy = this.convert(orgDetails);
    // copy.orgId = orgDetails.org.id;
    return this.http
      .post<OrgDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  update(orgDetails: OrgDetails): Observable<EntityResponseType> {
    const copy = this.convert(orgDetails);
    copy.orgId = <number>orgDetails.org;
    return this.http
      .put<OrgDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrgDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  query(orgId: number, req?: any): Observable<HttpResponse<OrgDetails[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgDetails[]>(`${this.resourceUrl}/read?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }

  read(key: string, orgId: number, req?: any): Observable<HttpResponse<OrgDetails[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgDetails[]>(`${this.resourceUrl}/read/${key}?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(orgId: number, searchBy: any): Observable<HttpResponse<OrgDetails[]>> {
    return this.http
      .get<OrgDetails[]>(`${this.resourceUrl}/search?key=${searchBy.key}&orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }
  getUrlDetails(req: any): Observable<EntityResponseType> {
    const copy = this.convert(req);
    return this.http
      .post<OrgDetails>(SERVER_API_URL + 'core/api/url/website/scrape', copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  downloadIndustryList() {
    return this.http.get(`${this.resourceUrl}/downloadIndustriesCsv`, { responseType: 'blob' });
  }
  uploadBulkDRDDomains(req: any, fileData: any) {
    return this.http.post(SERVER_API_URL + `org/api/drd-domains/upload?orgId=${req.orgId}`, fileData, { observe: 'response' });
  }
  uploadBulkDRDDomainKeywords(req: any, fileData: any) {
    return this.http.post(
      SERVER_API_URL + `org/api/drd-domain-keywords/upload?orgId=${req.orgId}&drddomainId=${req.drdDomainId}`,
      fileData,
      { observe: 'response' }
    );
  }
  addDRDDomain(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .post(SERVER_API_URL + `org/api/drd-domains`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  addDRDCompany(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .post(SERVER_API_URL + `org/api/drd-companies`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  updateDRDDomain(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .put(SERVER_API_URL + `org/api/drd-domains`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  updateDRDCompany(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .put(SERVER_API_URL + `org/api/drd-companies`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  addDRDDomainKeyword(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .post(SERVER_API_URL + `org/api/drd-domain-keywords`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }
  updateDRDDomainKeyword(req: any): Observable<EntityResponseType> {
    const options = this.convert(req);
    return this.http
      .put(SERVER_API_URL + `org/api/drd-domain-keywords`, options, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  deleteDRDDomainKeyword(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(SERVER_API_URL + `org/api/drd-domain-keywords/${id}`, { observe: 'response' });
  }

  getDRDDomains(req: any): Observable<HttpResponse<OrgDetails[]>> {
    return this.http
      .get<OrgDetails[]>(SERVER_API_URL + `org/api/drd-domains?orgId=${req.orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }
  // DEC 1175
  getDRDCompany(req: any): Observable<HttpResponse<OrgDetails[]>> {
    return this.http
      .get<OrgDetails[]>(SERVER_API_URL + `org/api/drd-companies?orgId=${req.orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }
  getDRDCompanybyId(req: any): Observable<HttpResponse<OrgDetails[]>> {
    return this.http
      .get<OrgDetails[]>(SERVER_API_URL + `org/api/drd-companies/${req.companyId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }
  deleteDRDCompanyKeyword(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(SERVER_API_URL + `org/api/drd-companies/${id}`, { observe: 'response' });
  }
  getDRDDomainKeywords(req: any): Observable<HttpResponse<OrgDetails[]>> {
    return this.http
      .get<OrgDetails[]>(SERVER_API_URL + `org/api/drd-domain-keywords?orgId=${req.orgId}&drdDomainId=${req.drdDomainId}`, {
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<OrgDetails[]>) => this.convertArrayResponse(res)));
  }

  getDRDDomainFile() {
    // url =this.resourceUrl+'/download';
    return this.http.get(SERVER_API_URL + `org/api/drd-domains/csvtemplatedownload`, { responseType: 'text' });
  }

  getDRDDomainKeywordFile() {
    // url =this.resourceUrl+'/download';
    return this.http.get(SERVER_API_URL + `org/api/drd-domain-keywords/csvtemplatedownload`, { responseType: 'text' });
  }

  searchDRDDomain(orgId: number, searchBy: any): Observable<HttpResponse<any[]>> {
    return this.http
      .get<any[]>(SERVER_API_URL + `org/api/drd-domains/search?domain=${searchBy.domain}&orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertArrayResponse(res)));
  }
  searchDRDCompany(orgId: number, searchBy: any): Observable<HttpResponse<any[]>> {
    return this.http
      .get<any[]>(SERVER_API_URL + `org/api/drd-companies/search?company=${searchBy.company}&orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertArrayResponse(res)));
  }

  filterDRDDomainKeywords(orgId: number, searchBy: any): Observable<HttpResponse<any[]>> {
    // tslint:disable-next-line:max-line-length
    return this.http
      .get<any[]>(
        SERVER_API_URL +
          `org/api/drd-domain-keywords/search?orgId=${orgId}&drdDomainId=${searchBy.drdDomainId}&assetType=${searchBy.drdKWAssetType}`,
        { observe: 'response' }
      )
      .pipe(map((res: HttpResponse<any[]>) => this.convertArrayResponse(res)));
  }

  drdDomainKeywordDownload(orgId: number, searchBy: any) {
    return this.http.get(
      // tslint:disable-next-line:max-line-length
      SERVER_API_URL +
        `org/api/drd-domain-keywords/download?orgId=${orgId}&drdDomainId=${searchBy.drdDomainId}&assetType=${searchBy.drdKWAssetType}`,
      { responseType: 'blob' }
    );
  }

  validateDRDDomainKeywordCsv(formData: FormData): Observable<HttpResponse<any>> {
    return this.http
      .post(SERVER_API_URL + `org/api/drd-domain-keywords/validate`, formData, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgDetails = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<OrgDetails[]>): HttpResponse<OrgDetails[]> {
    const jsonResponse: OrgDetails[] = res.body!;
    const body: OrgDetails[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to OrgDetails.
   */
  private convertItemFromServer(orgDetails: OrgDetails): OrgDetails {
    const copy: OrgDetails = Object.assign({}, orgDetails);
    return copy;
  }

  /**
   * Convert a OrgDetails to a JSON which can be sent to the server.
   */
  private convert(orgDetails: OrgDetails): OrgDetails {
    const copy: OrgDetails = Object.assign({}, orgDetails);
    return copy;
  }
}
