/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { DialogHistory } from '../../cyber-threat/models';
import { Subject } from 'rxjs';
import * as $ from 'jquery';
import { INTEGRATION_TYPE } from '../../app.constants';
@Injectable()
export class DataCommunicationService implements OnDestroy {
  public loggedUser: any = {};
  public changedOrgId!: number;
  private coreType: any;
  private tempValue: any = null;
  private queryParams: any;
  private previousPageStatus!: string;
  private currentClient: any;
  private dashboardDateValue: any = {
    defaultDate: null,
    isDefault: true,
    fromDate: Date,
    toDate: Date,
  };
  private keyNodes: any = {
    SHA: 0,
    MD5: 1,
    IP: 2,
    DOMAIN: 3,
    URL: 4,
    THREAT_ACTOR: 5,
    OPERATION: 6,
    IOA: 7,
    IOC: 8,
    HOSTNAME: 9,
    FILE: 10,
    SSL: 11,
    CVE: 12,
    EMAIL: 13,
    MUTEX: 14,
    EXPLOIT: 15,
    THREAT_ACTOR_ALIASE: 16,
    MALWARE: 17,
    VULNERABILITY: 18,
    EXPLOITS: 19,
    VENDORS: 20,
  };
  // private nodeGroup: any = { 0: 'SHA', 1: 'MD5', 2: 'IP', 3: 'Domain', 4: 'Url', 5: 'Threat Actor', 6: 'Operation', 7: 'IOA' };
  private allModules: any = [
    'Cyber Incident Analytics',
    'Threat Visibility and Intelligence',
    'Cyber Situational Awareness',
    'Cyber Education',
    'Cyber Vulnerability Analytics',
    'Cyber Risk Scoring',
    'Brand/Individual Cyber Risk Monitoring',
  ];
  private monthFormater: any = {
    0: 'Jan',
    1: 'Fab',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };
  private forwardStepsList: any[] = [];
  private modules = '';
  private mapNavigationState = '';
  private previousUrlStatus!: string;
  private previousParamsUrl!: string;
  private dialogConfig: any = {
    width: '90%',
    height: '80%',
    maxWidth: '100%',
    margin: 'auto',
    dWidth: '80%',
  };
  private activeTheme!: string;
  private industriesOptions!: any[];
  private technologiesOptions!: any[];
  private geographiesOptions!: any[];
  private _timer: any = null;
  private dashboardTabConfig: any = {
    tab: '',
    index: 0,
    org: null,
  };
  reportInfo: any = null;
  private earlyWarningInfo: any = {};
  private masterCountryCode: any = {};
  private navbarElement = new BehaviorSubject<any>(null);
  private apiStatus = new BehaviorSubject<any>(null);
  private navigatorStatus = new BehaviorSubject<any>(null);
  private mainNavigatorStatus = new BehaviorSubject<any>(null);
  private totalRecords = new BehaviorSubject<any>(null);
  private resetPageRecords = new Subject<any>();
  private pageChange = new Subject<object>();
  private digitalpageChange = new Subject<object>();

  private ajexState = new BehaviorSubject<boolean>(false);
  private menuNavigator = new BehaviorSubject<any>(null);
  private cloudTextTrigger = new BehaviorSubject<any>(null);
  private correlationNode = new BehaviorSubject<any>(null);
  private dialogCorrelationNode = new Subject<string>();
  private detailsCorrelationNode = new Subject<string>();
  private subscriptionStatus = new Subject<boolean>();
  private authExpiredSubscription = new BehaviorSubject<boolean>(false);
  private clientChangedSubscription = new Subject<any>();
  private dshATabSubs = new BehaviorSubject<string>('');
  private onPageScrolled = new BehaviorSubject<string>('');
  private externalRiskSummaryInformer = new Subject<any>();
  private orgRefererType = new Subject<string>();
  private logoChangedSubscription = new Subject<any>();
  navbarElement$ = this.navbarElement.asObservable();
  apiStatus$ = this.apiStatus.asObservable();
  navigatorStatus$ = this.navigatorStatus.asObservable();
  mainNavigatorStatus$ = this.mainNavigatorStatus.asObservable();
  totalRecords$ = this.totalRecords.asObservable();
  resetPageRecords$ = this.resetPageRecords.asObservable();
  pageChange$ = this.pageChange.asObservable();
  digitalpageChange$ = this.digitalpageChange.asObservable();

  ajexState$ = this.ajexState.asObservable();
  menuNavigator$ = this.menuNavigator.asObservable();
  onCloudTextTrigger$ = this.cloudTextTrigger.asObservable();
  onCorrelationNodeTriggered$ = this.correlationNode.asObservable();
  onDialogCorrelationNodeTriggered$ = this.dialogCorrelationNode.asObservable();
  onDetailsCorrelationNodeTriggered$ = this.detailsCorrelationNode.asObservable();
  subscriptionStatus$ = this.subscriptionStatus.asObservable();
  authExpiredSubscription$ = this.authExpiredSubscription.asObservable();
  clientChangedSubscription$ = this.clientChangedSubscription.asObservable();
  dshATabSubs$ = this.dshATabSubs.asObservable();
  onPageScrolled$ = this.onPageScrolled.asObservable();
  externalRiskSummaryInformer$ = this.externalRiskSummaryInformer.asObservable();
  orgRefererType$ = this.orgRefererType.asObservable();
  logoChangedSubscription$ = this.logoChangedSubscription.asObservable();
  logoUrl: String = '';
  constructor(private $sessionStorage: SessionStorageService, private $localStorage: LocalStorageService) {}
  setNavbarElementRef(elementRef: ElementRef) {
    this.navbarElement.next(elementRef);
  }
  setApiStatus(status: any) {
    this.apiStatus.next(status);
  }
  setSubscriptionStatus(status: boolean) {
    this.subscriptionStatus.next(status);
  }
  setNavigatorStatus(selectedNavItem: any) {
    this.navigatorStatus.next(selectedNavItem);
  }
  setMainNavigatorStatus(selectedMainNavItem: any) {
    this.mainNavigatorStatus.next(selectedMainNavItem);
  }
  setTotalRecords(totalItems: number, listItems: number, pageSize?: number) {
    const pageInfo: any = {};
    pageInfo.totalItem = totalItems ? Number(totalItems) : 1;
    if (!pageSize || pageSize === 0) {
      pageInfo.pageSize = 0;
    } else {
      pageInfo.pageSize = Number(pageSize);
    }
    if (!listItems || listItems === 0) {
      pageInfo.listItems = 0;
    } else {
      pageInfo.listItems = Number(listItems);
    }
    this.totalRecords.next(pageInfo);
  }
  resetPagerInfo() {
    const pager: any = {
      currentPage: 0,
      endIndex: 0,
      endPage: 0,
      pageSize: 10,
      pages: [],
      startIndex: 0,
      startPage: 0,
      totalItems: 0,
      totalPages: 0,
    };
    this.resetPageRecords.next(pager);
  }
  // getTotalRecords(): Observable<any> {
  //   return this.totalRecords.asObservable();
  // }
  onPageChange(pagerInfo: any) {
    this.pageChange.next(pagerInfo);
  }
  onDigitalPageChange(pagerInfo: any) {
    this.digitalpageChange.next(pagerInfo);
  }
  setAjexStatus(status: any) {
    this.ajexState.next(status);
  }
  setMenu(setTo: any) {
    this.menuNavigator.next(setTo);
  }
  // tag-cloud drill down communication
  onCloudTextTrigger(text: string) {
    this.cloudTextTrigger.next(text);
  }
  // node event communication
  onCorrelationNodeTriggered(text: string) {
    this.correlationNode.next(text);
  }
  onDialogCorrelationNodeTriggered(text: string) {
    this.dialogCorrelationNode.next(text);
  }
  onDetailsCorrelationNodeTriggred(text: string) {
    this.detailsCorrelationNode.next(text);
  }
  onClientChanged(cd: any) {
    this.clientChangedSubscription.next(cd);
  }
  changeLogo(logo: any): void {
    this.logoChangedSubscription.next(logo);
    this.logoUrl = logo;
  }
  getLogo(): any {
    return this.logoUrl;
  }
  onSubTabChanged(info: any) {
    this.externalRiskSummaryInformer.next(info);
  }
  onAuthExpired(inActive: boolean) {
    if (inActive) {
      this.authExpiredSubscription.next(inActive);
      this.$sessionStorage.clear('authenticationToken');
      this.$sessionStorage.clear();
    }
  }
  timer(set: boolean) {
    if (set) {
      let totalTime = 30 * 60 * 1000;
      if (this.checkAnalyst()) {
        totalTime = totalTime * 4;
      }
      this._timer = setInterval(() => {
        this.onAuthExpired(true);
        window.location.href = '/';
      }, totalTime);
    } else {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
        this.timer(true);
      }
    }
  }
  getDialogNodeTriggeredData(): Observable<string> {
    return this.dialogCorrelationNode.asObservable();
  }
  setTempValue(key: string) {
    this.tempValue = key;
  }
  getTempValue(): any {
    return this.tempValue;
  }
  resetTempValue(): void {
    this.tempValue = null;
  }
  // default dashboard date selection
  storeDasboardDate(dateValue: any) {
    if (dateValue.isDefault) {
      this.dashboardDateValue.isDefault = true;
      this.dashboardDateValue.defaultDate = dateValue.defaultDate;
    } else {
      this.dashboardDateValue.isDefault = false;
      this.dashboardDateValue.fromDate = dateValue.fromDate;
      this.dashboardDateValue.toDate = dateValue.toDate;
    }
  }
  getDashboardDate(): any {
    return this.dashboardDateValue;
  }
  getParams(url: string): string[] {
    const urlArr = url.split('/').slice(1);
    if (url.includes('?') && urlArr.length > 3) {
      const urlParam = urlArr[3].split('?');
      urlParam[1] = urlParam[1].slice(3);
      urlArr[2] = urlParam[0];
      urlArr[3] = urlParam[1];
    }
    return urlArr;
  }
  setQueryParams(params: any): void {
    this.queryParams = params;
  }
  getQueryParams(): any {
    return this.queryParams;
  }
  setPreviousUrlStatus(url: string, currentUrl?: boolean) {
    if (currentUrl) {
      this.previousParamsUrl = url;
    } else {
      this.previousUrlStatus = url;
    }
  }
  getPreviousUrlStatus(paramsUrl?: boolean) {
    return paramsUrl ? this.previousParamsUrl : this.previousUrlStatus;
  }
  getPreviousParams(url: string): any[] {
    const queryParams: any = {};
    if (url) {
      const paramsUrl = url.split('?')[1];
      if (paramsUrl) {
        const params = paramsUrl.split('&');
        params.map(_p => {
          queryParams[_p.split('=')[0]] = _p.split('=')[1];
        });
      }
    }
    return queryParams;
  }
  setPageStatus(status: string) {
    this.previousPageStatus = status;
  }
  getPreviousPageStatus() {
    return this.previousPageStatus;
  }
  // logged user info
  storeLoggedUser(user: any) {
    this.$sessionStorage.store('loggedinUser', user);
    this.changedOrgId = user.orgId;
    this.currentClient = {
      id: user.orgId,
      name: user.orgId === 0 ? '' : user.orgName,
      pov: user.pov,
      isThirdPartyDomainsEnable: user.isThirdPartyDomainsEnable,
    };
    this.onClientChanged(this.currentClient);
  }
  checkAnalyst(): boolean {
    this.loggedUser = this.$sessionStorage.retrieve('loggedinUser');
    if (this.loggedUser && (this.loggedUser.roleType === 'Analyst' || this.loggedUser.roleType === 'Sales')) {
      return true;
    } else {
      return false;
    }
  }
  getUserPermissions() {
    this.loggedUser = this.$sessionStorage.retrieve('loggedinUser');
    return this.loggedUser.permissions;
  }
  checkRootOrg(): boolean {
    this.loggedUser = this.$sessionStorage.retrieve('loggedinUser');
    if (this.loggedUser?.root) {
      return true;
    } else {
      return false;
    }
  }
  checkNormalUser(): boolean {
    return this.checkAnalyst() || this.checkRootOrg() ? false : true;
  }
  checkCustomerSupport(): boolean {
    const _loggedUser = this.getLoggedUser();
    if (_loggedUser && _loggedUser.roleType === 'Customer Support') {
      return true;
    } else {
      return false;
    }
  }
  checkMsspParent(): boolean {
    this.loggedUser = this.$sessionStorage.retrieve('loggedinUser');
    if (this.loggedUser && this.loggedUser.isMsspParent === true) {
      return true;
    } else {
      return false;
    }
  }
  getLoggedUser() {
    this.loggedUser = this.$sessionStorage.retrieve('loggedinUser');
    if (this.loggedUser && !this.currentClient) {
      this.currentClient = {
        id: this.loggedUser.orgId,
        name: this.loggedUser.orgId === 0 ? '' : this.loggedUser.orgName,
        pov: this.loggedUser.pov,
        isThirdPartyDomainsEnable: this.loggedUser.isThirdPartyDomainsEnable,
      };
      // this.onClientChanged(this.currentClient);
    }
    return this.loggedUser;
  }
  isSaaSUser(): boolean {
    const isSaaS: boolean = this.loggedUser && this.loggedUser.orgType === 'SaaS' ? true : false;
    return isSaaS;
  }
  isDRD(type?: string): boolean {
    if (type && type === 'premium') {
      const drdPremium: boolean =
        this.loggedUser && this.loggedUser.orgType === 'DRD' && this.loggedUser.roleType === 'DRDPremium' ? true : false;
      return drdPremium;
    } else {
      const drdPremium: boolean = this.loggedUser && this.loggedUser.orgType === 'DRD' ? true : false;
      return drdPremium;
    }
  }
  getModuleEnabledStatus(m: string): boolean {
    const _m = this.$sessionStorage.retrieve('_mods');
    if (_m) {
      if (m === 'cia' && _m.includes('Cyber Incident Analytics')) {
        return true;
      } else if (m === 'tvi' && _m.includes('Threat Visibility and Intelligence')) {
        return true;
      } else if (m === 'csa' && _m.includes('Cyber Situational Awareness')) {
        return true;
      } else if (m === 'ce' && _m.includes('Cyber Education')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getRefererType(): string {
    return this.getLoggedUser().refererType;
  }
  updateRefererType(type: string) {
    const loggedUserInfo = this.getLoggedUser();
    loggedUserInfo['refererType'] = type;
    this.storeLoggedUser(loggedUserInfo);
    this.orgRefererType.next(type);
  }
  accessView(permission: string): boolean {
    let access: boolean; // only permission type user can access.
    if (permission) {
      if (permission === 'DRDPremium') {
        return (access = this.isDRD() ? true : false);
      } else if (permission === 'cs') {
        return (access = this.checkCustomerSupport() ? true : false);
      } else if (permission === 'analyst') {
        return (access = this.checkAnalyst() ? true : false);
      } else if (permission === 'normal') {
        return (access = this.checkNormalUser() ? true : false);
      } else if (permission === 'v1') {
        const _env = window.location.hostname;
        if (_env.includes('qa')) {
          return (access = !(Number(this.getLoggedUser().orgId) > 900));
        } else {
          return (access = !(Number(this.getLoggedUser().orgId) > 1100)); // assuming > 1100 orgId is newly org, hide v1 access.
        }
      }
    } else {
      return (access = false);
    }
    return (access = false);
  }
  resetLoggedUser(): void {
    this.$sessionStorage.clear('loggedinUser');
  }
  setChangedOrg(id: number): void {
    this.changedOrgId = id ? id : 0;
  }
  getChangedOrg(): number {
    const id = this.changedOrgId ? this.changedOrgId : this.getLoggedUser().orgId;
    return id;
  }
  getSelectedOrgId(): number {
    return this.checkAnalyst() ? (this.getChangedOrg() ? this.getChangedOrg() : 0) : this.getLoggedUser().orgId;
  }
  setCurrentClientInfo(org: any) {
    this.currentClient = org;
  }
  getCurrentClientInfo() {
    return this.currentClient;
  }
  // language status
  storeLanguage(lan = 'en') {
    this.$sessionStorage.store('_lan', lan);
  }
  getLanguage(): string {
    if (this.$sessionStorage.retrieve('_lan')) {
      return this.$sessionStorage.retrieve('_lan');
    } else {
      return 'en';
    }
  }
  resetLanguage(): void {
    this.$sessionStorage.clear('_lan');
  }
  // store modules
  storeSubscribedModules(modules: string) {
    this.modules = modules;
    this.$sessionStorage.store('_mods', modules);
  }
  getSubscribedModules(subscribed: boolean): string[] {
    if (this.modules?.includes('#')) {
      if (subscribed) {
        return this.modules.split('#');
      } else {
        return this.unsubscribedModule(this.modules.split('#'));
      }
    } else {
      const _modules = this.$sessionStorage.retrieve('_mods') ? this.$sessionStorage.retrieve('_mods') : '';
      if (_modules.includes('#')) {
        if (subscribed) {
          return _modules ? _modules.split('#') : [];
        } else {
          if (_modules?.length) {
            return this.unsubscribedModule(_modules.split('#'));
          } else {
            return [''];
          }
        }
      } else {
        return [_modules];
      }
    }
  }
  unsubscribedModule(modules: any[]) {
    if (!modules) {
      return [];
    } else {
      const temp = [];
      for (let i = 0; i < this.allModules.length; i++) {
        if (modules.indexOf(this.allModules[i]) === -1) {
          temp.push(this.allModules[i]);
        }
      }
      return temp;
    }
  }
  resetModules(): void {
    this.$sessionStorage.clear('_mods');
  }
  // calculate from date & to date
  getDayDiff(days: number) {
    if (days) {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d;
    } else {
      return new Date();
    }
  }
  // min date validation
  minDate(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }
  // set & get forward steps for dialog multiple action
  setNext(nextItem: DialogHistory) {
    if (!this.forwardStepsList.length) {
      nextItem.index = 0;
      this.forwardStepsList.push(nextItem);
    } else if (this.forwardStepsList.length < 15) {
      const isDuplicate: any[] = this.forwardStepsList.map(_data => {
        if (_data.key === nextItem.key && _data.value === nextItem.value) {
          return true;
        } else {
          return false;
        }
      });
      if (isDuplicate.indexOf(true) === -1) {
        this.forwardStepsList.push(nextItem);
      }
    }
  }
  getDialogHistoryList(): DialogHistory[] {
    return this.forwardStepsList;
  }
  setDialogHistoryActiveIndex(currentItem: DialogHistory) {
    this.forwardStepsList = this.forwardStepsList.filter(_data => {
      if (_data.key === currentItem.key && _data.value === currentItem.value) {
        return false;
      } else {
        return true;
      }
    });
    this.forwardStepsList.push(currentItem);
  }
  resetDialogHistoryList(): void {
    this.forwardStepsList = [];
  }
  // filter correlation node data
  getCorrelationData(node: string, correlationData: any, ajexCalled: boolean) {
    let selectedCorrelationNodeList = [];
    // let nodeIndex: any = {};
    if (node) {
      if (correlationData.links) {
        const tempNodeList: any[] = [];
        if (correlationData.nodes.length) {
          ajexCalled = correlationData.nodes[0].x ? false : true;
        }
        if (ajexCalled) {
          // nodeIndex = correlationData.nodes.find((_nd) => _nd.name === node);
          correlationData.links.map((_links: any) => {
            if (node === _links.source) {
              const linkTarget: string = _links.target;
              const nodeIndex = correlationData.nodes.find((_nd: any) => _nd.name === linkTarget);
              const tempNode: any = {};
              tempNode['group'] = this.keyNodes[node];
              tempNode['id'] = nodeIndex.id;
              tempNode['name'] = nodeIndex.name;
              tempNode['imgUrl'] = nodeIndex.imgUrl;
              tempNodeList.push(tempNode);
            }
          });
        } else {
          correlationData.links.map((_node: any) => {
            if (node === _node.source.id) {
              const tempNode: any = {};
              tempNode['group'] = _node.target.group;
              tempNode['id'] = _node.target.id;
              tempNode['name'] = _node.target.name;
              tempNode['imgUrl'] = _node.target.imgUrl;
              tempNodeList.push(tempNode);
            }
          });
        }
        if (tempNodeList.length) {
          selectedCorrelationNodeList = tempNodeList.filter(_tnode => {
            if (this.getNodeKeys().indexOf(_tnode.id) > -1) {
              return false;
            } else {
              return true;
            }
          });
        }
      }
    }
    return selectedCorrelationNodeList.length ? selectedCorrelationNodeList : [];
  }

  // swap json: key -> value
  getNodeGroup() {
    const nodeGroup: any = this.keyNodes;
    return Object.keys(nodeGroup).reduce(function (obj: any, key) {
      obj[nodeGroup[key]] = key;
      return obj;
    }, {});
  }
  getNodeKeys(): string[] {
    return Object.keys(this.keyNodes);
  }
  // get & set map navigation previous state.
  setMapNavigationState(state: string): void {
    this.mapNavigationState = state;
  }
  getMapNavigationState(): string {
    return this.mapNavigationState;
  }
  // set local date format
  getDateFormat(reqDate: string, format?: string): string | Date {
    let dateFormat: string;
    const dateObj = reqDate ? new Date(reqDate) : new Date();
    const _month = dateObj.getMonth() + 1;
    const month = _month < 10 ? '0' + _month : _month;
    const day = dateObj.getDate() <= 9 ? '0' + dateObj.getDate() : dateObj.getDate();
    dateFormat = dateObj.getFullYear() + '-' + month + '-' + day;
    if (format && format === 'mm/dd/yyyy') {
      dateFormat = month + '/' + day + '/' + dateObj.getFullYear(); // MM/DD/YYYY
    } else if (format && format === 'dd-mm-yyyy') {
      dateFormat = `${day}-${this.monthFormater[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    }
    return dateFormat; // YYYY-MM-DD
  }
  // get all Attributes::
  getAttributes(key: string): string[] {
    const ATTRIBUTES = [
      'MD5',
      'SHA',
      'IP',
      'DOMAIN',
      'HOSTNAME',
      'URL',
      'EMAIL',
      'CVE',
      'EXPLOIT',
      'MUTEX',
      'FILE',
      'SSL',
      'MALWARE',
      'OPERATIONS',
      'IOAS',
    ];
    if (key === 'THREATACTOR') {
      return ATTRIBUTES.slice(12, ATTRIBUTES.length);
    } else if (key === 'IOC') {
      return ATTRIBUTES.slice(0, 12);
    } else {
      return ATTRIBUTES;
    }
  }

  getDialogConfig() {
    return this.dialogConfig;
  }

  setActiveTheme(name: string) {
    this.activeTheme = name;
    const user = this.$sessionStorage.retrieve('loggedinUser');
    user.theme = name;
    this.$sessionStorage.store('loggedinUser', user);
  }
  getActiveTheme(): string {
    return this.activeTheme;
  }
  advanceSearch(store: boolean, value?: string) {
    if (store) {
      this.$sessionStorage.store('sv', value);
    } else {
      return this.$sessionStorage.retrieve('sv');
    }
  }
  // reload browser forcelly
  reload(): void {
    window.location.reload();
  }
  // sort by date
  sortDate(list: any[], AS: boolean | string, sort_by?: string): any {
    if (list?.length) {
      if (!sort_by) {
        sort_by = 'dateTime';
      }
      if (AS && typeof AS === 'string') {
        return list;
      } else if (AS) {
        return list.sort((a, b) => new Date(b[sort_by!]).getTime() - new Date(a[sort_by!]).getTime());
      } else {
        return list.sort((a, b) => new Date(a[sort_by!]).getTime() - new Date(b[sort_by!]).getTime());
      }
    }
  }
  // option filter config
  getFilterConfigByType(type: string): any {
    if (type === 'industry') {
      return { filterBy: 'name', displayBy: 'name', type: 'industry' };
    } else if (type === 'technology') {
      return { filterBy: 'name', displayBy: 'name', type: 'technology' };
    } else {
      return { filterBy: 'name', displayBy: 'name', type: 'geography' };
    }
  }
  // set filter options
  setGIT(type: string, data: any) {
    if (type === 'geography') {
      this.geographiesOptions = data ? data : [];
      this.$sessionStorage.store('geographies', this.geographiesOptions);
    }
    if (type === 'industry') {
      this.industriesOptions = data ? data : [];
      this.$sessionStorage.store('industries', this.industriesOptions);
    }
    if (type === 'technology') {
      this.technologiesOptions = data ? data : [];
      this.$sessionStorage.store('technologies', this.technologiesOptions);
    }
  }
  // load filtered instance
  loadGIT(type: string): any {
    if (type === 'geography') {
      this.geographiesOptions = this.geographiesOptions ? this.geographiesOptions : this.$sessionStorage.retrieve('geographies');
      return this.sortBy('name', this.geographiesOptions);
    }
    if (type === 'industry') {
      this.industriesOptions = this.industriesOptions ? this.industriesOptions : this.$sessionStorage.retrieve('industries');
      return this.sortBy('name', this.industriesOptions);
    }
    if (type === 'technology') {
      this.technologiesOptions = this.technologiesOptions ? this.technologiesOptions : this.$sessionStorage.retrieve('technologies');
      return this.sortBy('name', this.technologiesOptions);
    }
  }
  // load GIT initialization config
  loadGitConfit() {
    const gitConfig: any = {
      geography: {
        config: {},
        list: [],
      },
      industry: {
        config: {},
        list: [],
      },
      technology: {
        config: {},
        list: [],
      },
    };
    return gitConfig;
  }
  // sort array
  sortBy(key: string, list: any[]) {
    if (list?.length) {
      return list.sort((firstElement, secondElement) => {
        if (firstElement[key] < secondElement[key]) {
          return -1;
        }
        if (firstElement[key] > secondElement[key]) {
          return 1;
        }
        return 0;
      });
    } else {
      return [];
    }
  }
  // set tab status
  setTabStatus(tabView: string, tabIndex?: any, org?: any, module?: string): void {
    this.dashboardTabConfig.tab = tabView;
    this.dashboardTabConfig.index = tabIndex ? tabIndex : 0;
    this.dashboardTabConfig.org = org;
    this.dashboardTabConfig.module = module ? module : null;
    this.$sessionStorage.store('at', JSON.stringify(this.dashboardTabConfig));
    this.dshATabSubs.next(tabView);
    if (tabIndex && tabIndex < 0) {
      this.onPageScrolled.next(tabView);
    }
  }
  setCategory(category?: string) {
    this.$sessionStorage.store('_category', category);
  }
  getCategory() {
    return this.$sessionStorage.retrieve('_category');
  }
  setView(view?: string) {
    this.$sessionStorage.store('_view', view);
  }
  getView() {
    return this.$sessionStorage.retrieve('_view');
  }
  // set earlyWarningInfo
  holdEarlyWarningInfo(info: any) {
    this.earlyWarningInfo = info;
  }
  storeReportInfo(info: any) {
    this.reportInfo = info;
  }
  getStoredReportInfo(): any {
    return this.reportInfo;
  }
  getEarlyWarningInfo(): any {
    return this.earlyWarningInfo && Object.keys(this.earlyWarningInfo).length ? this.earlyWarningInfo : null;
  }
  getTabStatus(): any {
    return this.dashboardTabConfig ? this.dashboardTabConfig : JSON.parse(this.$sessionStorage.retrieve('at'));
  }
  // file size conversion
  getFileSize(fileSize: number): string {
    let FILESIZE: string;
    if (!fileSize || fileSize === 0) {
      return '0 kb';
    } else {
      const fSize = Math.round(fileSize / 1024);
      if (fSize < 1000) {
        FILESIZE = fSize + ' kb';
      } else {
        const fSizeMB = Math.round(fSize / 1024);
        FILESIZE = fSizeMB + ' mb';
      }
      return FILESIZE;
    }
  }
  // get & set master country code
  storeCountryCode(ccData: any) {
    if (ccData && Object.keys(ccData).length) {
      this.masterCountryCode = ccData;
      this.$sessionStorage.store('cc', this.masterCountryCode);
    } else {
      this.masterCountryCode = {};
      this.$sessionStorage.store('cc', this.masterCountryCode);
    }
  }
  loadCountryCode() {
    return this.masterCountryCode && Object.keys(this.masterCountryCode).length
      ? this.masterCountryCode
      : this.$sessionStorage.retrieve('cc');
  }
  storeCSPResponse(res: any) {
    localStorage.setItem('Authorization', res['Authorization']);
    localStorage.setItem('x-Origin-Key', res['x-Origin-Key']);
    localStorage.setItem('x-Api-Key', res['x-Api-Key']);
  }
  getAuthorizationToken() {
    return this.$sessionStorage.retrieve('authenticationToken');
  }
  resetStorage(type: string) {
    if (type === 'session') {
      if (this.getRefererType() === INTEGRATION_TYPE[0]) {
        setTimeout(() => window.location.reload(), 400);
      }
      this.$sessionStorage.clear('geographies');
      this.$sessionStorage.clear('industries');
      this.$sessionStorage.clear('technologies');
      this.$sessionStorage.clear('loggedinUser');
      this.$sessionStorage.clear('cc');
      this.$sessionStorage.clear('_lan');
      this.$sessionStorage.clear('_mods');
      this.$sessionStorage.clear('at');
    } else if (type === 'local') {
      localStorage.clear();
    }
  }
  _clone(data: any, deepClone?: boolean) {
    if (!data) {
      return data;
    } else if (Array.isArray(data)) {
      // clone data for array
      if (deepClone) {
        // deep copy
        const clonedData = [];
        for (let i = 0; i < data.length; i++) {
          const _keys = Object.keys(data[i]);
          for (const _key of _keys) {
            const _tempObj: any = Object.assign({}, {});
            _tempObj[_key] = data[i][_key];
            clonedData.push(_tempObj);
          }
        }
        return clonedData;
      } else {
        // shallow copy
        return data.slice();
      }
    } else if (!Array.isArray(data) && typeof data === 'object') {
      if (deepClone) {
        // deep copy
        let clonedObj = Object.assign({}, {});
        clonedObj = $.extend(true, {}, data);
        // for (const _obj of Object.keys(data)) {
        //   clonedObj[_obj] = this._clone(data[_obj], deepClone);
        // }
        return clonedObj;
      } else {
        // shallow copy
        return { ...data };
      }
    }
  }
  getFeedsTypes() {
    const feedsTypes = [
      { name: 'RSS', value: 'rss' },
      { name: 'Twitter', value: 'twitter' },
    ];
    return feedsTypes;
  }
  getMalwaresType(): string[] {
    const MALWARESTYPE = ['Backdoor', 'Keylogger', 'Logic Bomb', 'Ransomware', 'Rootkits', 'Spyware', 'Trojan Horse', 'Viruse', 'Worm'];
    return MALWARESTYPE;
  }
  getCurrentSnapshotConfig(moduleName: string) {
    let csConfig: any[] = [];
    if (moduleName === 'CSA') {
      csConfig = [
        { name: 'threatactors', active: true, label: 'Threat Actors' },
        { name: 'darkweb', active: true, label: 'Dark Web' },
        { name: 'phishingattacks', active: true, label: 'Phishing Attacks' },
        { name: 'malwareattacks', active: true, label: 'Prevailing Malware Attacks' },
        { name: 'digital', active: true, label: 'Digital Risk/Brand Risk' },
        { name: 'news', active: true, label: 'Top News/Incidents/Breaches' },
        { name: 'vulnerability', active: true, label: 'Top Vulnerability Related to Your Assets' },
      ];
    }
    return csConfig;
  }
  // load report trends type
  getRpTrendsType() {
    return [
      { key: 'darkWebTrends', name: 'DARK WEB / HACKER FORUM', active: true },
      { key: 'digitalRiskTrends', name: 'DIGITAL RISK', active: true },
      { key: 'externalThreatScoreTrends', name: 'EXTERNAL THREAT SCORE', active: true },
      { key: 'newsTrends', name: 'LATEST CYBERSECURITY NEWS', active: true },
      { key: 'cyberAttackTrends', name: 'PREVAILING CYBERATTACKS', active: true },
      { key: 'riskScoreTrends', name: 'RISK SCORE', active: true },
      { key: 'threatLandscapeTrends', name: 'THREAT LANDSCAPE', active: true },
      { key: 'vulnerabilityTrends', name: 'SOFTWARE THREATS AND VULNERABILITIES', active: true },
    ];
  }
  // get browser info
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let tem: any;
    let Media = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ?? [];
    const Vender = navigator.vendor;
    if (/trident/i.test(Media[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) ?? [];
      return { name: 'IE ', version: tem[1] || '', vender: Vender };
    }
    if (Media[1] === 'Chrome') {
      tem = userAgent.match(/\bOPR\/(\d+)/);
      if (tem != null) {
        return { name: 'Opera', version: tem[1], vender: Vender };
      }
    }
    Media = Media[2] ? [Media[1], Media[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) {
      Media.splice(1, 1, tem[1]);
    }
    return {
      name: Media[0],
      version: Media[1],
      vender: Vender,
    };
  }
  // convert riskLevel to priority
  getPriorityValue(value: any, isLong?: boolean): string {
    if (!value) {
      return isLong ? 'Low' : 'L';
    } else {
      if (isNaN(value)) {
        const lValue = value.toLowerCase();
        return isLong ? lValue : lValue ? lValue.charAt(0) : 'L';
      } else {
        const riskValue = parseInt(value, 10);
        if (isLong) {
          return riskValue < 3 ? 'low' : riskValue < 6 ? 'medium' : riskValue < 9 ? 'high' : 'critical';
        } else {
          return riskValue < 3 ? 'L' : riskValue < 6 ? 'M' : riskValue < 9 ? 'H' : 'C';
        }
      }
    }
  }
  // get situational awareness type
  storeSituationalAwarenessType(satype: any) {
    this.$sessionStorage.store('_satype', satype);
  }
  getSituationalAwarenessType(): string {
    if (this.$sessionStorage.retrieve('_satype')) {
      return this.$sessionStorage.retrieve('_satype');
    } else {
      return '';
    }
  }
  closeMatDialog(dialogRef: any, self?: boolean) {
    if (self) {
      dialogRef.closeAll();
    } else {
      dialogRef.close();
    }
  }
  checkForCriticalItem(data: any, key?: string): boolean {
    if (!data) {
      return false;
    } else if (key) {
      return data[key] >= 9 ? !data.isNew : false;
    } else {
      return (data.riskScore || data.cyfirmaScore || data.riskLevel || data.riskRating) >= 9 ? !data.isNew : false;
    }
  }
  getCspUrl() {
    let _cspURL = '';
    const _env = window.location.hostname;
    const _qp = `userId=${encodeURIComponent(this.getLoggedUser().email)}&token=${this.getAuthorizationToken()}`;
    if (_env.includes('qa') || _env.includes('staging')) {
      _cspURL = 'https://qacsp.cyfirma.com/csp/#/access?';
    } else {
      _cspURL = 'https://csp.cyfirma.com/#/access?';
    }
    return _cspURL + _qp;
  }
  owt(_url: string, _target?: string) {
    Object.assign(document.createElement('a'), {
      target: _target ? _target : '_blank',
      href: _url,
      rel: 'noreferrer',
    }).click();
  }
  tabDayDif(tab: string): number {
    const defaultDayDiff: any = { operations: 1, management: 7, executive: 30 };
    return defaultDayDiff[tab];
  }
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
  apiStatusColorCode: any = {
    200: '#3BDD38',
    201: '#3BDD38',
    203: '#3BDD38',
    204: '#3BDD38',
    300: '#DADD38',
    301: '#DADD38',
    302: '#DADD38',
    400: '#DD6038',
    401: '#DD6038',
    403: '#DD6038',
    404: '#DD6038',
    409: '#DD6038',
    500: '#DD3842',
    501: '#DD3842',
    502: '#DD3842',
    503: '#DD3842',
    504: '#DD3842'
  };

  getCoreType() {
    return this.coreType;
  }

  setCoreType(type: any) {
    this.coreType = type;
  }
  wipVersion(v: string): boolean {
    // temp for wip list page v2.
    return v && v === 'v2' ? true : false;
  }

  attackSurfaceEWAssetRiskRating(data: any): any {
    if (data.isEarlyWarningAsset) {
      return Math.max(Number(data.earlyWarningAssetRiskScore), Number(data.riskRating));
    } else {
      return data.riskRating;
    }
  }

  ngOnDestroy() {
    this.navbarElement.unsubscribe();
    this.apiStatus.unsubscribe();
    this.navigatorStatus.unsubscribe();
    this.mainNavigatorStatus.unsubscribe();
    this.totalRecords.unsubscribe();
    this.resetPageRecords.unsubscribe();
    this.pageChange.unsubscribe();
    this.ajexState.unsubscribe();
    this.menuNavigator.unsubscribe();
    this.cloudTextTrigger.unsubscribe();
    this.correlationNode.unsubscribe();
    this.dialogCorrelationNode.unsubscribe();
    this.detailsCorrelationNode.unsubscribe();
    this.subscriptionStatus.unsubscribe();
    this.authExpiredSubscription.unsubscribe();
    this.clientChangedSubscription.unsubscribe();
    this.dshATabSubs.unsubscribe();
    this.onPageScrolled.unsubscribe();
    this.externalRiskSummaryInformer.unsubscribe();
    this.logoChangedSubscription.unsubscribe();
  }
}
