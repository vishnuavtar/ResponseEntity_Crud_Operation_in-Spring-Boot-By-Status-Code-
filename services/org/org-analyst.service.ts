/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_API_URL } from '../app.constants';

import { OrgAnalyst } from './models';

export type EntityResponseType = HttpResponse<OrgAnalyst>;

@Injectable()
export class OrgAnalystService {
  private resourceUrl = SERVER_API_URL + 'org/api/org-analysts';

  constructor(private http: HttpClient) {}

  create(orgAnalyst: OrgAnalyst, type?: string): Observable<EntityResponseType> {
    // const copy = this.convert(orgAnalyst);
    if (type && (type === 'sales' || type === 'presales')) {
      const _rurl = `org/api/orgs/${type}`;
      return this.http
        .post<OrgAnalyst>(SERVER_API_URL + _rurl, orgAnalyst, { observe: 'response' })
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    } else {
      return this.http
        .post<OrgAnalyst>(this.resourceUrl + '/group', orgAnalyst, { observe: 'response' })
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }
  }

  // private convert(orgAnalyst: OrgAnalyst): OrgAnalyst {
  //     const copy: OrgAnalyst = Object.assign({}, orgAnalyst);
  //     return copy;
  // }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: OrgAnalyst = this.convertItemFromServer(res.body!);
    return res.clone({ body });
  }

  private convertItemFromServer(orgAnalyst: OrgAnalyst): OrgAnalyst {
    const copy: OrgAnalyst = Object.assign({}, orgAnalyst);
    return copy;
  }
}
