/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';
import { map } from 'rxjs/operators';

import { Org, OrgAudit, OrgUserAudit } from './models';
import { createRequestOption } from '../shared';

export type EntityResponseType = HttpResponse<Org>;

@Injectable()
export class OrgService {
  private resourceUrl = SERVER_API_URL + 'org/api/orgs';
  private resourceUrlDetct = SERVER_API_URL + 'org/api/orgs-drd';

  private resourceUrl1 = SERVER_API_URL + 'org/api/org';
  private alertsUrl = SERVER_API_URL + 'core/api/alerts';
  constructor(private http: HttpClient) {}
  create(org: Org): Observable<EntityResponseType> {
    const copy = this.convert(org);
    return this.http
      .post<Org>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    // .map((res: EntityResponseType) => this.convertResponse(res));
  }

  update(org: Org): Observable<EntityResponseType> {
    const copy = this.convert(org);
    return this.http
      .put<Org>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    // .map((res: EntityResponseType) => this.convertResponse(res));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Org>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    // .map((res: EntityResponseType) => this.convertResponse(res));
  }

  findOrgUserCount(id: number): Observable<HttpResponse<Org>> {
    return this.http
      .get<Org>(`${this.resourceUrl}/usercount/${id}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<Org>) => this.convertResponse(res)));
    // .map((res: HttpResponse<Org>) => this.convertResponse(res));
  }

  query(req?: any): Observable<HttpResponse<Org[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Org[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res));
  }

  findAll(req?: any): Observable<HttpResponse<Org[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Org[]>(`${req.decyfir ? this.resourceUrl : this.resourceUrlDetct  }?orgType=true`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res)));
      
    // .map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res));
  }

  findAllOrgNames(orgId?: any): Observable<HttpResponse<Org[]>> {
    return this.http
      .get<Org[]>(`${this.resourceUrl}/name?orgId=${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res));
  }

  orgAuditList(orgId: number, req?: any): Observable<HttpResponse<OrgAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgAudit[]>(`${SERVER_API_URL}/org/api/org-audits?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgAudit[]>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<OrgAudit[]>) => this.convertArrayResponse(res));
  }

  orgUserAuditList(orgId: number, req?: any): Observable<HttpResponse<OrgAudit[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<OrgUserAudit[]>(`${SERVER_API_URL}/org/api/org-user-audits?orgId=${orgId}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<OrgUserAudit[]>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<OrgUserAudit[]>) => this.convertArrayResponse(res));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(searchOrgs: any, searchSales: any, searchCreatedby: any, status: any, req?: any): Observable<HttpResponse<Org[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<Org[]>(
        `${this.resourceUrl}/search?name=${searchOrgs}&salesEmail=${searchSales}&orgType=true&createdby=${searchCreatedby}&status=${status}`,
        { params: options, observe: 'response' }
      )
      .pipe(map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<Org[]>) => this.convertArrayResponse(res));
  }

  getOrgList(): Observable<HttpResponse<any>> {
    return this.http
      .get<Org[]>(`${SERVER_API_URL}/org/api/org-analysts/list`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<any>) => this.convertArrayResponse(res));
  }

  getAllOrgList(): Observable<HttpResponse<any>> {
    return this.http
      .get(`${SERVER_API_URL}/org/api/org-analysts/list/orgs`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<any>) => this.convertArrayResponse(res));
  }

  getOrgMsspList(): Observable<HttpResponse<any>> {
    return this.http
      .get<Org[]>(`${SERVER_API_URL}/org/api/org-mssp/list`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<any>) => this.convertArrayResponse(res));
  }
  getOrgCompleteList(): Observable<HttpResponse<any>> {
    return this.http
      .get<Org[]>(`${SERVER_API_URL}/org/api/org-analysts/list/all-orgs`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<any>) => this.convertArrayResponse(res));
  }
  // file upload to s3 server
  uploadImgFile(imageFiles: File[]): any {
    const headers = new HttpHeaders();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Content-Type', 'application/json');
    const fileData: FormData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      fileData.append('file', imageFiles[i]);
      return this.http.post('org/api/filereport/image', fileData, { headers });
    }
  }
  // file upload to s3 server
  uploadCsvFile(csvFiles: File[]): any {
    const headers = new HttpHeaders();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Content-Type', 'application/json');
    const fileData: FormData = new FormData();
    for (let i = 0; i < csvFiles.length; i++) {
      fileData.append('file', csvFiles[i], csvFiles[i].name);
      return this.http.post('org/api/html-report-sections/uploadCSV', fileData, { headers });
    }
  }
  // Export ORG filtered org created by
  exportCSVforOrgCreatedBy(filter: string, status: string) {
    return this.http.get(
      `${this.resourceUrl1}/createdby/download?orgTypeName=&orgTypeForDecyfir=true&createdby=${filter}&status=${status}`,
      { responseType: 'blob' }
    );
  }
  // API Doc Download
  downloadApiDocPDF() {
    return this.http.get(`https://db25dv50edmh2.cloudfront.net/CYFIRMA-_DeCYFIR_API_DETAILS_V0.4.pdf`, { responseType: 'blob' });
  }
  // module subscription details by module name:
  getModuleSubscribedDetails(id: number, name: string): Observable<EntityResponseType> {
    return this.http
      .get<Org>(`${SERVER_API_URL}org/api/org-subscriptions/module?orgId=${id}&moduleName=${name}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    // .map((res: EntityResponseType) => this.convertResponse(res));
  }
  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: Org = this.convertItemFromServer(res.body as any);
    return res.clone({ body });
  }

  private convertArrayResponse(res: HttpResponse<Org[]>): HttpResponse<Org[]> {
    const jsonResponse: Org[] = res.body as any;
    const body: Org[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to Org.
   */
  private convertItemFromServer(org: Org): Org {
    const copy: Org = Object.assign({}, org);
    return copy;
  }

  /**
   * Convert a Org to a JSON which can be sent to the server.
   */
  private convert(org: Org): Org {
    const copy: Org = Object.assign({}, org);
    return copy;
  }

  getAlerts(orgId: number, req?: any, fromDate?: any, toDate?: any, type?: string): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any>(`${this.alertsUrl}/listing?orgId=${orgId}&fromDate=${fromDate}&toDate=${toDate}&alertType=${type}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    // .map((res: HttpResponse<any>) => this.convertArrayResponse(res));
  }

  getCustomerSupportId(orgId: number): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(`${this.resourceUrl}/getCustomerSupportId/${orgId}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => res));
    //  .map((res: HttpResponse<any>) => res);
  }

  uploadCompanyLogo(orgId: number, file: File) {
    const headers = new HttpHeaders();
    headers.append('enctype', 'multipart/form-data');
    headers.append('Content-Type', 'application/json');
    const fileData: FormData = new FormData();
    fileData.append('file', file);
    return this.http.post<any>(`${this.resourceUrl}/logo/${orgId}`, fileData, { 'headers': headers });
  }
}
