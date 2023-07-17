/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrgDialogComponent } from './';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Org } from './models';
import { OrgService } from './org.service';
import { DataCommunicationService } from '../shared';
import { MatDialogComponent } from '../shared/components';
import { saveAs } from 'file-saver';

@Component({
  selector: 'jhi-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.scss'],
})
export class OrgComponent implements OnInit, OnDestroy {
  orgList: any[] = [];
  pagerSubscription: Subscription;
  apiStatusSubscription: Subscription;
  pagerInfo: any = {};
  searchOrgs!: string;
  searchSales!: string;
  searchCreatedby = '';
  status = 'Active';
  orgstatus: any = {};
  searchStatus!: string;
  loggedinUserDet: any = {};
  loggedinOrgDet: any;
  vulClientSubCat!: string;
  vulnAssetWithVerFlag = false;
  sveCat = 'Active';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private orgService: OrgService,
    private dataCommunicationService: DataCommunicationService
  ) {
    this.pagerInfo = {
      currentPage: 1,
      pageSize: 20,
      sort: ['id,DESC'],
    };
    this.pagerSubscription = this.dataCommunicationService.pageChange$.subscribe(pager => {
      if (pager) {
        this.pagerInfo = pager;
        if (this.pagerInfo) {
          if (this.searchOrgs || this.searchSales || this.searchCreatedby) {
            this.searchByName();
          } else {
            this.getAllOrgs(this.pagerInfo, this.sveCat);
            this.loggedinUserDet = this.dataCommunicationService.getLoggedUser();
            this.getLoggedInOrgs(this.loggedinUserDet.orgId);
          }
        }
      }
    });
    this.apiStatusSubscription = this.dataCommunicationService.apiStatus$.subscribe(status => {
      if (status) {
        if (status.status === 'success') {
          this.getAllOrgs(this.pagerInfo, this.sveCat);
          this.loggedinUserDet = this.dataCommunicationService.getLoggedUser();
          this.getLoggedInOrgs(this.loggedinUserDet.orgId);
        }
      }
    });
  }

  ngOnInit() {
    this.getAllOrgs(this.pagerInfo, this.sveCat);
    this.loggedinUserDet = this.dataCommunicationService.getLoggedUser();
    this.getLoggedInOrgs(this.loggedinUserDet.orgId);
    this.searchSales = '';
  }

  resetPageInfo(): void {
    this.dataCommunicationService.setTotalRecords(0, 0, 0);
    this.pagerInfo = {
      currentPage: 1,
      pageSize: 20,
      sort: ['id,DESC'],
    };
  }

  openDialog(action: any, selectedData?: any) {
    if (action === 'create') {
      const actionData: any = { action: 'createOrg', label: 'Create Organisation' };
      if (selectedData) {
        actionData.label = 'Update Organisation';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '80%',
        height: '90%',
        disableClose: true,
        data: actionData,
      });
    }
  }
  getAllOrgs(pager?: any, orgstatus?: any) {
    const req: any = {
      page: pager.currentPage - 1,
      size: pager.pageSize,
      sort: ['name,ASC'],
      status: orgstatus,
    };
    this.dataCommunicationService.setAjexStatus(true);
    this.orgService.findAll(req).subscribe({
      next: (res: HttpResponse<Org[]>) => {
        const totalItems: any = res.headers.get('X-Total-Count');
        this.dataCommunicationService.setTotalRecords(totalItems, res.body!.length, 20);
        this.orgList = res.body as any;
        this.dataCommunicationService.setAjexStatus(false);
      },
      error: (res: HttpErrorResponse) => this.onError(res.message),
    });
  }

  showAllSales(data: any[], prop: string): string {
    if (data.length) {
      return data.map(_sobj => _sobj[prop]).join(', ');
    } else {
      return '';
    }
  }

  getLoggedInOrgs(id: number) {
    this.orgService.find(id).subscribe(
      (res: HttpResponse<Org>) => {
        this.loggedinOrgDet = res.body!.rootOrg;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  openOrgDetails(orgId: any) {
    this.dataCommunicationService.setMenu('Basic Details');
    // this.dataCommunicationService.setNavigatorStatus('Basic Details');
    this.router.navigate([`cap/org/${orgId}`]);
  }

  search() {
    if (this.searchOrgs || this.searchSales || this.searchCreatedby) {
      this.resetPageInfo();
      this.searchByName();
    } else {
      this.getAllOrgs(this.pagerInfo, this.sveCat);
    }
  }
  getListByStatus(cat: string) {
    this.resetPageInfo();
    this.status = cat;
    this.searchOrgs = '';
    this.searchSales = '';
    this.searchCreatedby = '';
    this.getAllOrgs(this.pagerInfo, this.status);
  }
  searchByName() {
    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['name,ASC'],
    };
    this.dataCommunicationService.setAjexStatus(true);
    this.orgService.search(this.searchOrgs, this.searchSales, this.searchCreatedby, this.status, req).subscribe({
      next: (res: HttpResponse<Org[]>) => {
        const totalItems: any = res.headers.get('X-Total-Count');
        this.dataCommunicationService.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
        this.orgList = res.body as any;
        this.dataCommunicationService.setAjexStatus(false);
      },
      error: (res: HttpErrorResponse) => this.onError("Internal Server Error !"),
    });
  }

  resetAll() {
    this.resetPageInfo();
    this.searchOrgs = '';
    this.searchCreatedby = '';
    this.searchSales = '';
    this.getAllOrgs(this.pagerInfo, this.sveCat);
  }

  private onError(error: any) {
    this.dataCommunicationService.setAjexStatus(false);
    this.dialog.open(MatDialogComponent, {
      width: '340px',
      data: { action: 'API_ERROR', message: error },
    });
  }

  setAddress(address: any, city: any, state: any, country: any, zip: any): string {
    let fullAddress = '';
    // address
    if (address) {
      fullAddress = address;
    }
    // city
    if (city && address) {
      fullAddress = fullAddress.concat(',' + city);
    } else {
      fullAddress = fullAddress.concat(city);
    }
    // state
    if (state && city) {
      fullAddress = fullAddress.concat(',' + state);
    } else if (state && address) {
      fullAddress = fullAddress.concat(',' + state);
    } else {
      fullAddress = fullAddress.concat(state);
    }
    // country
    if (country && state) {
      fullAddress = fullAddress.concat(',' + country);
    } else if (country && city) {
      fullAddress = fullAddress.concat(',' + country);
    } else if (country && address) {
      fullAddress = fullAddress.concat(',' + country);
    } else {
      fullAddress = fullAddress.concat(country);
    }
    // zip
    if (zip && country) {
      fullAddress = fullAddress.concat(',' + zip);
    } else if (zip && state) {
      fullAddress = fullAddress.concat(',' + zip);
    } else if (zip && city) {
      fullAddress = fullAddress.concat(',' + zip);
    } else if (zip && address) {
      fullAddress = fullAddress.concat(',' + zip);
    } else {
      fullAddress = fullAddress.concat(zip);
    }
    // Full Address Present
    if (fullAddress) {
      return fullAddress;
    } else {
      return '--';
    }
  }

  exportCSVforCreatedBy() {
    if (this.searchCreatedby === '') {
      return;
    }
    this.dataCommunicationService.setAjexStatus(true);
    this.orgService.exportCSVforOrgCreatedBy(this.searchCreatedby, this.status).subscribe(
      res => {
        this.dataCommunicationService.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, `OrgExport_Created_By.csv`);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  // redirect to dahsboard
  reload() {
    window.location.reload();
  }
  ngOnDestroy() {
    // prevent from memory leak
    this.apiStatusSubscription.unsubscribe();
    this.pagerSubscription.unsubscribe();
  }
}
