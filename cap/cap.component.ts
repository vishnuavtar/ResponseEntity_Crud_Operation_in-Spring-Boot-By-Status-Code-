/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService, DataService, JhiLanguageHelper } from '../shared';
import { LoginService } from '../login/login.service';
import { OrgService } from '../org/org.service';
import { TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ClientIncidentService, PhishingService, ThreatActorService } from '../core/services';
import { saveAs } from 'file-saver';
import {
  ClientIncidentComponent,
  PhishingDetailsComponent,
  CommonVulnerabilityDetailsComponent,
  AttacksurfaceComponent,
} from '../shared/components';
import { ClientIncident } from '../core/models';
import { SaDashboardService } from '../situational/services';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { INTEGRATION_TYPE } from '../app.constants';
import { CapService } from './cap.service';
import { Org } from '../org/models';
import { CyberThreatDashboardService } from '../cyber-threat/services/cyber-threat-dashboard.service';
import { AttackSurfaceDialogComponent } from '../modules/tvi/list-view/attacksurface/dialog/dialog.component';
@Component({
  selector: 'jhi-cap',
  templateUrl: './cap.component.html',
  styleUrls: ['./cap.component.scss'],
})
export class CapComponent implements OnInit, OnDestroy {
  pagerInfo: any = {};
  routeName!: string;
  rootOrg!: boolean;
  isAnalyst: boolean;
  isMsspParent: boolean;
  isDRDUser!: boolean;
  sidebarCollapsed = true;
  loggedUserInfo: any;
  selectedModule!: string;
  pov = '';
  menuItem: any;
  orgs!: any[];
  msspOrgs!: any[];
  _mms: any[];
  subscriptionStatus: Subscription;
  selectedOrg: any = {
    name: '',
    id: 0,
  };
  filterOptions: any = {
    keywords: [],
    searchBy: '',
    key: 'Keywords',
  };
  // git variable
  gitFilterInfo: any = {};
  selectedGITOption: any = {};
  s3BaseUrl: string;
  // modules tab initilization
  modulesTab: any = {
    st: '',
    tvi: {
      active: true,
      tabs: [
        { name: 'executive', active: true, icon: 'executive_view_v2.png', width: 100 },
        { name: 'management', active: true, icon: 'management_view_v2.png', width: 125 },
        { name: 'operations', active: true, icon: 'operations_view_v2.png', width: 125 },
        { name: 'digital risk discovery', active: false, icon: '', width: 100 },
        { name: 'search', active: true, icon: '', width: 300 },
        { name: 'reports', active: true, icon: 'reports_view_v2.png', width: 95 },
      ],
    },
    org: {
      tabs: [],
    },
    navItems: [],
  };
  alertCollapsed = true;
  alerts: any[] = [];
  dialogConfig: any;
  UAName: string;
  selectedLanguage: string;
  refererType: string;
  languages!: any[];
  private clientSubscription: Subscription;
  private analystObserver: Subscription;
  // databreachIpVulnerabilityService: any;
  filterOrg = '';
  correlationAccess = false;
  private logoSubscription: Subscription;
  logoURL: String = '';
  innerWidth: Number = 0;
  @HostListener('windowresize', ['$event'])
  onResize(event: any): any {
    this.innerWidth = window.innerWidth;
  }
  sortOptions: any = {
    "0": { title: "Org ID Asc", next: "1" },
    "1": { title: "Org ID Desc", next: "2" },
    "2": { title: "Name Asc", next: "3" },
    "3": { title: "Name Desc", next: "0" }
  }
  selectedSortOption: any = "0";
  constructor(
    private router: Router,
    private phishingService: PhishingService,
    // private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    public dialog: MatDialog,
    private dcs: DataCommunicationService,
    private ds: DataService,
    private sads: SaDashboardService,
    private clientIncidentService: ClientIncidentService,
    private orgService: OrgService,
    private threatActorService: ThreatActorService,
    private titlecasePipe: TitleCasePipe,
    private capService: CapService,
    private eventManager: JhiEventManager,
    private ctds: CyberThreatDashboardService
  ) {
    this.innerWidth = window.screen.width;
    this.loggedUserInfo = this.dcs.getLoggedUser();
    this.selectedOrg.id = this.loggedUserInfo.orgId;
    // this.switchByOrg(this.selectedOrg);
    this.menuItem = { ...this.ds.getMenus('all') };
    this.isAnalyst = false;
    this.isMsspParent = false;
    this._mms = this.ds.getMenuItems('menuList').slice();
    this.getGITOptions();
    this.gitFilterInfo = this.dcs.loadGitConfit();
    this.s3BaseUrl = this.ds.getS3BaseIconsUrl('latest');
    this.selectedLanguage = this.dcs.getLanguage();
    this.UAName = this.dcs.getBrowserInfo().name ? this.dcs.getBrowserInfo().name.toLowerCase() : '';
    this.refererType = this.dcs.getRefererType();
    this.subscriptionStatus = this.dcs.subscriptionStatus$.subscribe(status => {
      if (status) {
        this.getSubscriptionList();
      } else {
        this.checkRootUserPermission();
      }
    });
    this.clientSubscription = this.dcs.clientChangedSubscription$.subscribe((_ci: any) => {
      if (_ci) {
        if (_ci.pov) {
          this.pov = _ci.pov;
          if (this.pov === 'TRIAL_POV') {
            this.filterOptions.keywords = this.ds.getKeywordsOptions('TVI').map((el: any) => {
              if (el.id !== 'Keywords') {
                el.active = false;
              }
              return el;
            });
          }
        } else {
          this.pov = null as any;
          this.filterOptions.keywords = this.ds.getKeywordsOptions('TVI').map((el: any) => {
            el.active = true;
            return el;
          });
        }
        this.dcs.setAjexStatus(true);
        this.orgService.getAlerts(this.selectedOrg.id).subscribe(
          (response: HttpResponse<any[]>) => {
            this.dcs.setAjexStatus(false);
            this.alerts = response.body ? response.body : []; // list data
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      }
    });
    this.logoSubscription = this.dcs.logoChangedSubscription$.subscribe((_logo: any) => {
      this.logoURL = _logo;
    });
    if(this.dcs.getLogo()) {
      this.logoURL = this.dcs.getLogo();
    }
    router.events.subscribe((val: any) => {
      
      if (val?.url) {
        const _url = val.url;
        if (_url !== '/' && this.refererType && this.refererType.toLowerCase() === INTEGRATION_TYPE[0]) {
          // window.location.replace(`cap/org/${this.loggedUserInfo.orgId}`);
          this.router.navigate([`cap/org/${this.loggedUserInfo.orgId}`]);
          return;
        } else {
          if (_url.includes('/cap/org')) {
            this.modulesTab['navItems'] = this.modulesTab['org'].tabs;
          } else if (_url.includes('/cap/tvi')) {
            this.modulesTab['navItems'] = this.modulesTab['tvi'].tabs;
            if (_url === '/cap/tvi') {
              this.modulesTab.st = 'executive';
              this.selectedModule = 'tvi';
            }
          } else if (_url.includes('/cap/situational')) {
            this.selectedModule = 'situational';
            this.modulesTab['navItems'] = [];
          } else if (_url.includes('/cap/cyber-incident')) {
            this.selectedModule = 'cyber-incident';
            this.modulesTab['navItems'] = [];
          } else if (_url.includes('/cap/cyberedu')) {
            this.selectedModule = 'cyberedu';
            this.modulesTab['navItems'] = [];
          }
        }
      }
    });
    this.dcs.orgRefererType$.subscribe((type: string) => (this.refererType = type ? type : ''));
    this.analystObserver = this.eventManager.subscribe('on-analyst-update', (data: any) => {
      this.loadOrgs();
    });
  }
  ngOnInit() {
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    // window.scrollTo(0, 0);
    this.getSubscriptionList();
    this.checkRootUserPermission();
    this.isDRDUser = this.dcs.isDRD();
    this.dialogConfig = this.dcs.getDialogConfig();
    this.isAnalyst = this.dcs.checkAnalyst();
    this.isMsspParent = this.dcs.checkMsspParent();
    this.selectedModule = this.router.url.split('/')[2];
    this.modulesTab.st = this.router.url.split('/')[3];
    this.loadOrgs();
    this.filterOptions.keywords = this.ds.getKeywordsOptions('TVI');
    this.dcs.setTabStatus(this.modulesTab.st, null, this.selectedOrg.id, this.selectedModule.toUpperCase());
    this.pov = this.dcs.getCurrentClientInfo() && this.dcs.getCurrentClientInfo().pov ? this.dcs.getCurrentClientInfo().pov : null;
    if (this.pov === 'TRIAL_POV') {
      this.filterOptions.keywords = this.ds.getKeywordsOptions('TVI').map((el: any) => {
        if (el.id !== 'Keywords') {
          el.active = false;
        }
        return el;
      });
    } else {
      this.filterOptions.keywords = this.ds.getKeywordsOptions('TVI').map((el: any) => {
        el.active = true;
        return el;
      });
    }
    setTimeout(() => this.loadGITOptions(), 2000);
    this.languageHelper.getAll().then(languages => {
      this.languages = languages;
    });
    if (
      this.loggedUserInfo &&
      (this.loggedUserInfo.email.match('om.prakash') ||
        this.loggedUserInfo.email.match('satya.prakash') ||
        this.loggedUserInfo.email.match('vinod.kailas'))
    ) {
      this.correlationAccess = true;
    }
  }
  checkRootUserPermission() {
    if (!this.dcs.checkNormalUser()) {
      this.rootOrg = true;
    } else {
      this.rootOrg = false;
    }
  }
  loadOrgs() {
    this.orgService.getOrgList().subscribe(
      res => {
        this.orgs = res.body;
        const noneSelection = {
          name: 'Please select a company',
          id: 0,
        };
        this.orgs.unshift(noneSelection);
      },
      error => this.onError(error)
    );
    this.orgService.getOrgMsspList().subscribe(
      res => {
        this.msspOrgs = res.body;
        const noneSelection = {
          name: this.loggedUserInfo.orgName,
          id: this.loggedUserInfo.orgId,
        };
        this.msspOrgs.unshift(noneSelection);
      },
      error => this.onError(error)
    );
  }
  switchTab(module: string, tab: string) {
    this.dcs.setTabStatus(tab, null, this.selectedOrg.id, module.toUpperCase());
    this.modulesTab.st = tab;
    if (tab === 'executive' || tab === 'management' || tab === 'operations') {
      this.dcs.onSubTabChanged({ key: tab });
    }
    if (tab === 'reports') {
      this.router.navigate([`cap/${module}`, 'report-view'], { queryParams: { type: 'daily' } });
    } else {
      if (tab === 'digital risk discovery') {
        tab = 'drd';
      }
      this.router.navigate([`cap/${module}`, tab]);
    }
  }
  switchByOrg(org: any) {
    this.selectedOrg.name = org.id === 0 ? '' : org.name;
    this.selectedOrg.id = org.id === 0 ? this.dcs.getLoggedUser().orgId : org.id;
    this.orgService.find(this.selectedOrg.id).subscribe((res: HttpResponse<Org>) => {
      if (res.body?.thirdPartyDomainsEnable) {
        org['isThirdPartyDomainsEnable'] = res.body.thirdPartyDomainsEnable;
        this.selectedOrg['isThirdPartyDomainsEnable'] = res.body.thirdPartyDomainsEnable;
      }
      if (res.body?.pov) {
        org['pov'] = res.body.pov;
        this.selectedOrg['pov'] = res.body.pov;
      } else {
        delete this.selectedOrg.pov;
        delete org.pov;
      }
      this.dcs.setChangedOrg(this.selectedOrg.id);
      this.dcs.setCurrentClientInfo(org);
      this.dcs.onClientChanged(this.selectedOrg);
    });
  }
  navigateModule(moduleName: string) {
    this.dcs.setTabStatus('', null, 0);
    this.selectedModule = this.isAnalyst && moduleName === 'tvi' ? 'cyber-threat' : moduleName;
    // this.selectedModule = moduleName;
    this.router.navigate(['cap', moduleName]);
  }
  navigateHelpmenu(routename: string, params: string) {
    // this.router.navigate([`cap/${routename}?lang=${params}`]);
    this.selectedModule = routename;
    this.router.navigate([`cap/${routename}`], { queryParams: { lang: params } });
  }
  downloadHelpmenu(params: string) {
    let url, filename: any;
    if (params === 'eng') {
      url = 'https://s3.ap-northeast-1.amazonaws.com/cap-media/DeCYFIR_User_Manual.pdf';
      filename = 'DeCYFIR_User_Manual';
    } else {
      url = ' https://s3.ap-northeast-1.amazonaws.com/cap-media/DeCYFIR_USER_MANUAL_V5.1_JP.pdf';
      filename = 'DeCYFIR_USER_MANUAL_V5.1_JP';
    }
    this.dcs.setAjexStatus(true);
    this.ds.getPdfFile(url).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, filename + '.pdf');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    // this.router.navigate([`cap/${routename}`], { queryParams: { lang: params } });
  }
  goTo(route: string, navItem: string) {
    this.router.navigate([`cap/${route}/${navItem}`]);
    setTimeout(() => {
      this.dcs.setMenu(navItem);
    }, 100);
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  toggleLanguage(lan: string) {
    this.selectedLanguage = lan;
    this.changeLanguage(this.selectedLanguage);
  }
  changeLanguage(languageKey: string) {
    this.languageService.changeLanguage(languageKey);
    this.dcs.storeLanguage(languageKey);
  }
  openSideMenu() {
    const x: any = document.getElementById('sidenav');
    if (x.style.display === 'block') {
      x.style.display = 'none';
    } else {
      x.style.display = 'block';
    }
  }
  // search keywords
  searchKeywords(key: string, searchedItem: string) {
    if (!!searchedItem) {
      const _key = key.toLowerCase();
      if (_key === 'threat actor') {
        this.router.navigate(['cap/keyword-search'], {
          queryParams: { type: _key, search: this.filterOptions.searchBy, module: this.selectedModule, keywords: true },
        });
      } else if (_key === 'malware' || _key === 'campaign') {
        this.router.navigate(['cap/keyword-search'], {
          queryParams: { type: _key, search: this.filterOptions.searchBy, module: this.selectedModule },
        });
      } else {
        this.ds.searchKeywords(key, searchedItem, this.dcs.getTabStatus().module, false);
      }
    }
  }
  getSubscriptionList() {
    if (this.dcs.getSubscribedModules(true).length) {
      const subscribedModule = this.dcs.getSubscribedModules(true);
      for (let i = 0; i < this._mms.length; i++) {
        if (subscribedModule.indexOf(this._mms[i].name) === -1) {
          this._mms[i].active = false;
        } else {
          this._mms[i].active = true;
        }
      }
    }
  }

  openTagView(tag: any, kwdSearch?: boolean) {
    this.ds.searchKeywords('Keywords', tag, 'TVI', false, null);
  }
  // Geography, Industry & Technology: GIT setup
  loadGITOptions() {
    this.gitFilterInfo['industry'].config = this.dcs.getFilterConfigByType('industry');
    this.gitFilterInfo['industry'].list = this.dcs.loadGIT('industry');
    this.gitFilterInfo['technology'].config = this.dcs.getFilterConfigByType('technology');
    this.gitFilterInfo['technology'].list = this.dcs.loadGIT('technology');
    this.gitFilterInfo['geography'].config = this.dcs.getFilterConfigByType('geography');
    this.gitFilterInfo['geography'].list = this.dcs.loadGIT('geography');
  }
  // catch event on selection change::
  onGITSelection(e: any): any {
    this.selectedGITOption = e;
    const keywordType = this.selectedGITOption.type.toLowerCase();
    switch (keywordType) {
      case 'industry':
        this.openTagView(this.selectedGITOption.name, true);
        break;
      case 'technology':
        this.openTagView(this.selectedGITOption.name, true);
        break;
      case 'geography':
        this.openTagView(this.selectedGITOption.name, true);
        break;
      default:
        return false;
    }
  }
  // convert riskLevel to priority
  getPriorityValue(value: any): string {
    if (!value) {
      return 'LOW';
    } else {
      if (isNaN(value)) {
        const lValue = value.toLowerCase();
        return lValue === 'l' ? 'LOW' : lValue === 'm' ? 'MEDIUM' : lValue === 'HIGH' ? 'H' : 'CRITICAL';
      } else {
        const riskValue = parseInt(value, 10);
        return riskValue < 3 ? 'LOW' : riskValue < 6 ? 'MEDIUM' : riskValue < 9 ? 'HIGH' : 'CRITICAL';
      }
    }
  }
  // alert toggle
  toggleAlert(): void {
    this.alertCollapsed = !this.alertCollapsed;
    // alerts api called
    this.dcs.setAjexStatus(true);
    const req: any = {
      page: 0,
      size: 10,
      sort: ['createdDate,DESC'],
    };
    this.orgService.getAlerts(this.selectedOrg.id, req, null, null, null as any).subscribe(
      (response: HttpResponse<any[]>) => {
        this.dcs.setAjexStatus(false);
        this.alerts = response.body ? response.body : []; // list data
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  navigateAlerts() {
    this.alertCollapsed = true;
    this.router.navigate(['cap/alert-center'], { queryParams: { tab: 3 } });
  }
  // short name for first & last name
  getSN(fullName: string): any {
    let sn = '';
    if (fullName && fullName !== '') {
      const names = fullName.split(' ');
      if (names.length) {
        sn = names.length > 1 ? names[0].charAt(0) + names[1].charAt(0) : names[0].charAt(0);
        return sn.toUpperCase();
      }
    } else {
      return (sn = this.loggedUserInfo.email.charAt(0).toUpperCase());
    }
  }
  // get filter options
  getGITOptions() {
    this.threatActorService.getAllCountryCode().subscribe(
      response => {
        this.dcs.storeCountryCode(response.body);
      },
      err => this.onError(err)
    );
    this.sads.getAllInductry().subscribe(
      res => {
        this.dcs.setGIT('industry', res.body);
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
    this.sads.getAllTechnology(true).subscribe(
      res => {
        this.dcs.setGIT('technology', res.body);
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
    this.sads.getAllCountry().subscribe(
      res => {
        this.dcs.setGIT('geography', res.body);
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
  }
  // logout
  logout() {
    this.dcs.resetStorage('session');
    this.dcs.resetStorage('local');
    this.loginService.logout();
    this.router.navigate(['']);
  }
  onAlertClicked(alert: any) {
    const at = alert.type.toLowerCase();
    switch (at) {
      case 'phishing':
        this.callPhishingAlerts(alert);
        break;
      case 'digital risk':
        if (alert.fullData && Object.keys(alert.fullData).length) {
          alert.fullData['_component'] = 'alert';
          alert.fullData['createdDate'] = alert.fullData['createdDate'] ? alert.fullData['createdDate'] : alert.createdDate;
          this.ds.openDLDetails(alert.fullData);
        } else {
          this.callClientIncidentAlerts(alert);
        }
        break;
      case 'vulnerability':
        this.callVulnerabilityAlerts(alert);
        break;
      case 'attack_surface':
      case 'attack surface':
        this.callAttacksurfaceDetails(alert);
        break;
      case 'certificates':
        this.callAttacksurfaceDetails(alert);
        break;
      default:
        break;
    }
  }
  callClientIncidentAlerts(alert: any) {
    this.dcs.setAjexStatus(true);
    this.clientIncidentService.find(alert.parentId).subscribe(
      (res: HttpResponse<ClientIncident>) => {
        this.dcs.setAjexStatus(false);
        // this.Client = res.body;
        const clientinc = res.body;
        this.dialog.open(ClientIncidentComponent, {
          width: this.dialogConfig.dWidth,
          height: 'auto',
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: alert.category, label: alert.category, data: clientinc },
          panelClass: 'slide-ltr',
        });
      },
      (error: HttpErrorResponse) => this.onError(error, true)
    );
  }
  callPhishingAlerts(alert: any) {
    this.dcs.setAjexStatus(true);
    this.phishingService.find(alert.parentId).subscribe(
      (res: HttpResponse<any>) => {
        this.dcs.setAjexStatus(false);
        this.dialog.open(PhishingDetailsComponent, {
          width: this.dialogConfig.width,
          height: this.dialogConfig.height,
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: alert.category, label: alert.category, data: res.body },
          panelClass: 'slide-ltr',
        });
      },
      (error: HttpErrorResponse) => this.onError(error, true)
    );
  }
  callVulnerabilityAlerts(alert: any) {
    const searchedItem = alert.title.split(':')[0].trim();
    const vulnerability = {
      id: searchedItem,
      category: 'vulnerability',
    };
    this.dcs.setAjexStatus(false);
    this.dialog.open(CommonVulnerabilityDetailsComponent, {
      width: this.dialogConfig.width,
      height: this.dialogConfig.height,
      maxWidth: this.dialogConfig.maxWidth,
      disableClose: true,
      data: { action: 'VULNERABILITY', label: searchedItem, data: vulnerability, createdDate: alert.createdDate },
      panelClass: 'slide-ltr',
    });
  }

  callAttacksurfaceDetails(_data: any) {
    if (_data.fullData && Object.keys(_data.fullData).length) {
      const dialogActionConfigs: any = {
        certificates: 'Certificates',
        'ip / domain reputation': 'ip/domain',
        'ip / domain vulnerability': 'Domain',
        'open ports': 'Openports',
        'cloud weakness': 'cloudWeakness',
        configuration: 'Configurations',
      };
      _data['orgId'] = this.selectedOrg.id;
      _data['action'] = `Attack Surface ${dialogActionConfigs[_data.subCategory.toLowerCase()]}`;
      _data.fullData['_readOnly'] = true;
      _data.fullData['_component'] = 'alert';
      _data.fullData['createdDate'] = _data.fullData['createdDate'] ? _data.fullData['createdDate'] : _data.createdDate;
      this.dialog.open(AttackSurfaceDialogComponent, {
        width: '70%',
        height: '80%',
        maxWidth: this.dialogConfig.maxWidth,
        disableClose: true,
        data: { action: _data.action, label: _data.type, data: _data.fullData },
        panelClass: 'slide-ltr',
      });
    } else {
      this.dcs.setAjexStatus(false);
      this.ctds.getClientServerById(_data.parentId).subscribe(
        (res: HttpResponse<any>) => {
          _data['trigger'] = 'alert_center';
          this.dialog.open(AttacksurfaceComponent, {
            width: this.dialogConfig.width,
            height: this.dialogConfig.height,
            maxWidth: this.dialogConfig.maxWidth,
            disableClose: true,
            data: { action: 'Attack Surface', label: _data.type, data: _data },
            panelClass: 'slide-ltr',
          });
        },
        (error: HttpErrorResponse) => this.onError(error, true)
      );
    }
  }

  getFormattedData(myData: string) {
    if (myData) {
      if (myData.indexOf(':') > 0) {
        return myData.split(':')[0].toUpperCase() + ' : ' + this.titlecasePipe.transform(myData.split(':')[1]);
      }
      // tslint:disable-next-line:one-line
      else {
        return myData;
      }
    } else {
      return '';
    }
  }
  showInqiries() {
    this.selectedModule = 'inquiries';
    const _csurl = this.dcs.getCspUrl(); // 'https://staging.xlayer.in/csp/#/';// 'https://csp.cyfirma.com';
    this.router.navigate([]).then(result => {
      this.dcs.owt(_csurl, '_blank');
      // window.open(_csurl, '_blank');
    });

    // comment below code to diactivate inquiries.
    // this.dialog.open(InquiriesFormComponent, {
    //   width: this.dialogConfig.dWidth,
    //   height: 'auto',
    //   maxWidth: this.dialogConfig.maxWidth,
    //   disableClose: true,
    //   data: { label: 'Inquiries Form' },
    //   panelClass: 'slide-ltr'
    // });
  }
  onInactiveIOC(error: any): void {
    this.ds.onInactiveIOC(error);
  }
  changeSort() {
    this.selectedSortOption = this.sortOptions[this.selectedSortOption].next;
  }
  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
    if (this.eventManager) {
      this.eventManager.destroy(this.analystObserver);
    }
  }
  private onError(error: any, inactiveIOC?: boolean): void {
    this.dcs.setAjexStatus(false);
    if (inactiveIOC) {
      this.onInactiveIOC(error);
    }
  }
}
