import { UserRouteAccessService } from '../shared';
import { OrgComponent } from './org.component';
import { OrgDetailsComponent } from './org-details/org-details.component';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

@Injectable()
export class OrgResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
    const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort),
    };
  }
}

export const OrgRoute: Routes = [
  {
    path: 'org',
    component: OrgComponent,
    resolve: {
      pagingParams: OrgResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'orgs.org.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'org/:id',
    component: OrgDetailsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'orgs.org.orgdetails.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
