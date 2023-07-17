/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

import {
  ThreatActorsComponent,
  IocComponent,
  TagSearchComponent,
  CommonVulnerabilityDetailsComponent,
  MatDialogComponent,
  ReportDialogComponent,
  ThreatStoryComponent,
  MalwareComponent,
  CampaignComponent,
  PhishingDetailsComponent,
  CorrelationExpandedViewComponent,
  CyfirmaResearchComponent,
} from '../../shared/components';
import { DataCommunicationService } from './data-communication.service';
import { CyberThreatDashboardService } from '../../cyber-threat/services/cyber-threat-dashboard.service';
import { PhishingService } from '../../core/services/phishing.service';
import { MenuItems, SnapShotConfig } from '../model/common-model';
// import * as D3 from 'd3';
import { JhiDateUtils } from 'ng-jhipster';
import { MarkSafeReq } from '../../modules/tvi/list-view/digitalrisk/digitalrisk.model';
import { DigitalriskSectionPopupComponent } from '../../modules/tvi/list-view/digitalrisk/digitalrisk-section-popup/digitalrisk-section-popup.component';
// declare const d3: any;
@Injectable()
export class DataService {
  dateOptions: any[];
  dateOptionsRiskView: any[];
  private fillScale: any;
  private colorPlate: string[];
  private modules: Array<any>;
  private keywordSearch: any = {};
  private tagDetails: any = {
    label: 'surfaceWeb',
    data: {},
    module: 'TVI',
  };
  private menuItem: MenuItems = {};
  private menus: any = {};
  private dialogConfig: any;
  public mapConfig: any = {};
  // private baseS3IconsUrl: string;
  private baseS3IconUrl1: string;
  public vulComment: string;
  private snapshotConfig: SnapShotConfig[];
  phishing: any;
  constructor(
    private http: HttpClient,
    private ctds: CyberThreatDashboardService,
    private corePhishingService: PhishingService,
    private dcs: DataCommunicationService,
    public dialog: MatDialog,
    public tagSearchDialog: MatDialog,
    private router: Router,
    private dateUtils: JhiDateUtils
  ) {
    // this.baseS3IconsUrl = 'https://cap-media.s3-ap-northeast-1.amazonaws.com/icons/';
    this.baseS3IconUrl1 = 'https://db25dv50edmh2.cloudfront.net/'; // 'https://s3.ap-northeast-1.amazonaws.com/cap-media/';
    // this.fillScale = D3.scaleOrdinal(d3.schemeCategory20);
    this.dialogConfig = this.dcs.getDialogConfig();
    this.colorPlate = ['#002C63', '#EF2424', '#8345D4', '#5171FA', '#E23283', '#EF5D47', '#FDB71B'];
    this.mapConfig = {
      mouseWheelZoomEnabled: true,
      sa: {
        geography: { sa: 'situationalAwareness' },
        charts: {},
      },
    };
    this.dateOptions = [
      { value: 'zero', displayLabel: 'Select Date', days: null },
      { value: 'lastDay', displayLabel: 'Last 1 Day', days: 1 },
      { value: 'fiveDays', displayLabel: 'Five Days', days: 5 },
      { value: 'oneWeek', displayLabel: 'One Week', days: 7 },
      { value: 'oneMonth', displayLabel: 'One Month', days: 30 },
      { value: 'threeMonths', displayLabel: 'Three Months', days: 90 },
      { value: 'sixMonths', displayLabel: 'Six Months', days: 180 },
      { value: 'lastYear', displayLabel: 'Last Year', days: 365 },
      { value: 'customDate', displayLabel: 'Custom Date', days: 0 },
    ];
    this.dateOptionsRiskView = [
      { value: 'zero', displayLabel: 'Select Date', days: null, monthCount: 0 },
      { value: 'threeMonths', displayLabel: 'Three Months', days: 90, monthCount: 3 },
      { value: 'sixMonths', displayLabel: 'Six Months', days: 180, monthCount: 6 },
      { value: 'oneYear', displayLabel: 'One Year', days: 365, monthCount: 12 },
      // { 'value': 'customDate', 'displayLabel': 'Custom Date', 'days': 0 }
    ];
    this.menus = {
      menuList: [
        {
          name: 'Threat Visibility and Intelligence',
          active: true,
          menuIcon: this.baseS3IconUrl1 + 'threatvisibility_analytics_v1.png',
          jhiLabel: 'threat',
          routeLabel: 'tvi',
          // 'routeLabel': 'cyber-threat',
          subMenus: [
            {
              name: 'dashboard',
              displayName: 'Dashboard',
            },
          ],
        },
        {
          name: 'Cyber Situational Awareness',
          active: true,
          menuIcon: this.baseS3IconUrl1 + 'situational_awareness_v1.png',
          jhiLabel: 'situational',
          routeLabel: 'situational',
          subMenus: [
            {
              name: 'dashboard',
              displayName: 'Dashboard',
            },
          ],
        },
        {
          name: 'Cyber Incident Analytics',
          active: true,
          menuIcon: this.baseS3IconUrl1 + 'incident_analytics_v1.png',
          jhiLabel: 'incident',
          routeLabel: 'cyber-incident',
          subMenus: [
            {
              name: 'dashboard',
              displayName: 'Dashboard',
            },
          ],
        },
        {
          name: 'Cyber Education',
          active: true,
          menuIcon: this.baseS3IconUrl1 + 'cyber_education_v1.png',
          jhiLabel: 'cyberedu',
          routeLabel: 'cyberedu',
          subMenus: [
            {
              name: 'dashboard',
              displayName: 'Dashboard',
            },
            {
              name: 'emailTemplate',
              displayName: 'Email Template',
            },
            {
              name: 'target',
              displayName: 'Target',
            },
            {
              name: 'targetGroup',
              displayName: 'Target Group',
            },
            {
              name: 'mailProfile',
              displayName: 'Mail Profile',
            },
            {
              name: 'landingPage',
              displayName: 'Landing Page',
            },
            {
              name: 'attachments',
              displayName: 'Attachment',
            },
            {
              name: 'customForm',
              displayName: 'Custom Forms',
            },
            {
              name: 'campaign',
              displayName: 'Campaign',
            },
            {
              name: 'training',
              displayName: 'Training',
            },
          ],
        },
        // {
        //   'name': 'Cyber Vulnerability Analytics',
        //   'active': true,
        //   'menuIcon': this.baseS3IconUrl1 + 'vulnerability_v1.png',
        //   'jhiLabel': 'vulnerability',
        //   'routeLabel': 'vulnerability',
        //   'subMenus': [
        //     {
        //       'name': 'dashboard',
        //       'displayName': 'Dashboard'
        //     }
        //   ]
        // },
        // {
        //   'name': 'Cyber Risk Scoring',
        //   'active': true,
        //   'menuIcon': this.baseS3IconUrl1 + 'risk_scoring_v1.png',
        //   'jhiLabel': 'risk',
        //   'routeLabel': 'cyber-risk',
        //   'subMenus': [
        //     {
        //       'name': 'dashboard',
        //       'displayName': 'Dashboard'
        //     }
        //   ]
        // },
        // {
        //   'name': 'Brand/Individual Cyber Risk Monitoring',
        //   'active': true,
        //   'menuIcon': this.baseS3IconUrl1 + 'brandindividual_riskmonitoring_v1.png',
        //   'jhiLabel': 'riskMonitoring',
        //   'routeLabel': 'risk-monitoring',
        //   'subMenus': [
        //     {
        //       'name': 'dashboard',
        //       'displayName': 'Dashboard'
        //     }
        //   ]
        // }
      ],
    };
    this.keywordSearch = {
      SA: [
        { id: 'Incidents', name: 'ANALYSED INCIDENTS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_-analysed incident.png' },
        { id: 'Domain', name: 'DOMAIN', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Domain.png' },
        { id: 'Exploit', name: 'EXPLOIT', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Exploit.png' },
        { id: 'Geography', name: 'GEOGRAPHY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Geography.png' },
        { id: 'Industry', name: 'INDUSTRY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Industry.png' },
        { id: 'IP', name: 'IP', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_IP.png' },
        { id: 'Keywords', name: 'KEYWORDS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Keyword.png' },
        // { id: 'Malware', name: 'MALWARE', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Malware.png' },
        { id: 'MD5', name: 'MD5', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_md5.png' },
        { id: 'SHA', name: 'SHA', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_SHA1.png' },
        { id: 'Technology', name: 'TECHNOLOGY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Technology.png' },
        { id: 'Threat Actor', name: 'THREAT ACTORS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Threat Actor.png' },
        { id: 'URL', name: 'URL', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_URL.png' },
        { id: 'Vulnerability', name: 'VULNERABILITY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_vulnerability.png' },
      ],
      TVI: [
        // { id: 'Incidents', name: 'ANALYSED INCIDENTS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_-analysed incident.png' },
        { id: 'Campaign', name: 'CAMPAIGN', active: true, icon: this.baseS3IconUrl1 + 'Campaign_v1_1.png' },
        { id: 'Domain', name: 'DOMAIN', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Domain_v1.png' },
        { id: 'Exploit', name: 'EXPLOIT', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Exploit_v1.png' },
        { id: 'File', name: 'FILE', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_File_v1.png' },
        { id: 'Geography', name: 'GEOGRAPHY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Geography_v1.png' },
        { id: 'Industry', name: 'INDUSTRY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Industry_v1.png' },
        { id: 'IP', name: 'IP', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_IP_v1.png' },
        { id: 'Keywords', name: 'KEYWORDS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Keyword_v1.png' },
        { id: 'Malware', name: 'MALWARE', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Malware_v1.png' },
        { id: 'MD5', name: 'MD5', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_md5_v1.png' },
        { id: 'Phishing', name: 'PHISHING', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_phishing_v1.png' },
        { id: 'SHA', name: 'SHA', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_SHA1_v1.png' },
        { id: 'Technology', name: 'TECHNOLOGY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Technology_v1.png' },
        { id: 'Threat Actor', name: 'THREAT ACTORS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Threat_Actor_v1.png' },
        { id: 'URL', name: 'URL', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_URL_v1.png' },
        { id: 'Vulnerability', name: 'VULNERABILITY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_vulnerability_v1.png' },
      ],
      CIA: [
        { id: 'Incidents', name: 'ANALYSED INCIDENTS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_-analysed incident.png' },
        { id: 'Domain', name: 'DOMAIN', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Domain.png' },
        { id: 'Exploit', name: 'EXPLOIT', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Exploit.png' },
        { id: 'Geography', name: 'GEOGRAPHY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Geography.png' },
        { id: 'Industry', name: 'INDUSTRY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Industry.png' },
        { id: 'IP', name: 'IP', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_IP.png' },
        { id: 'Keywords', name: 'KEYWORDS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Keyword.png' },
        { id: 'MD5', name: 'MD5', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_md5.png' },
        { id: 'Phishing', name: 'PHISHING', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_phishing.png' },
        { id: 'SHA', name: 'SHA', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_SHA1.png' },
        { id: 'Technology', name: 'TECHNOLOGY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Technology.png' },
        { id: 'Threat Actor', name: 'THREAT ACTORS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Threat Actor.png' },
        { id: 'URL', name: 'URL', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_URL.png' },
        { id: 'Vulnerability', name: 'VULNERABILITY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_vulnerability.png' },
      ],
      CVA: [
        { id: 'Incidents', name: 'ANALYSED INCIDENTS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_-analysed incident.png' },
        { id: 'Domain', name: 'DOMAIN', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Domain.png' },
        { id: 'Exploit', name: 'EXPLOIT', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Exploit.png' },
        { id: 'Geography', name: 'GEOGRAPHY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Geography.png' },
        { id: 'Industry', name: 'INDUSTRY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Industry.png' },
        { id: 'IP', name: 'IP', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_IP.png' },
        { id: 'Keywords', name: 'KEYWORDS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Keyword.png' },
        { id: 'MD5', name: 'MD5', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_md5.png' },
        { id: 'SHA', name: 'SHA', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_SHA1.png' },
        { id: 'Technology', name: 'TECHNOLOGY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Technology.png' },
        { id: 'Threat Actor', name: 'THREAT ACTORS', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Threat Actor.png' },
        { id: 'URL', name: 'URL', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_URL.png' },
        { id: 'Vulnerability', name: 'VULNERABILITY', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_vulnerability.png' },
      ],
      nodeType: [
        { id: 'Domain', name: 'DOMAIN', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Domain.png' },
        { id: 'IP', name: 'IP', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_IP.png' },
        { id: 'MD5', name: 'MD5', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_md5.png' },
        { id: 'SHA', name: 'SHA', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_SHA1.png' },
        { id: 'Threat Actor', name: 'Threat Actor', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_Threat Actor.png' },
        { id: 'URL', name: 'URL', active: true, icon: this.baseS3IconUrl1 + 'CYFIRMA_icon_URL.png' },
        // { id: 'SSL', name: 'SSL', active: false },
        // { id: 'FILE', name: 'FILE', active: false }
      ],
    };
    this.modules = [
      {
        name: 'SA',
        displayLabel: 'Situational Awareness',
        news: [
          { name: 'news', displayLabel: 'News/Article' },
          { name: 'regulatory', displayLabel: 'Regulatory Changes' },
          { name: 'databreach', displayLabel: 'Recent Data Breaches' },
        ],
      },
      {
        name: 'CIA',
        displayLabel: 'Cyber Incident',
        news: [
          { name: 'cyberAttacks', displayLabel: 'Latest Cyber Attacks' },
          { name: 'databreach', displayLabel: 'Latest data breaches' },
        ],
      },
      {
        name: 'CVA',
        displayLabel: 'Cyber Vulnerability',
        news: [
          { name: 'vulnerability', displayLabel: 'Latest Vulnerabilities' },
          { name: 'exploits', displayLabel: 'Latest Exploits' },
        ],
      },
      {
        name: 'CE',
        displayLabel: 'Cyber Education',
        news: [{ name: '', displayLabel: '' }],
      },
    ];
    this.menuItem.org = [
      {
        name: 'assets',
        displayName: 'Assets',
        active: true,
      },
      {
        name: 'basicdetails',
        displayName: 'Basic Details',
        active: true,
      },
      {
        name: 'orgdetails',
        displayName: 'Org Details',
        active: true,
      },
      {
        name: 'roles',
        displayName: 'Roles',
        active: true,
      },
      {
        name: 'users',
        displayName: 'Users',
        active: true,
      },
    ];
    this.menuItem.reports = [
      {
        name: 'htmlreport',
        displayName: 'Online',
        active: true,
      },
      {
        name: 'filereport',
        displayName: 'File',
        active: true,
      },
      {
        name: 'recommendation',
        displayName: 'Recommendations',
        active: true,
      },
      {
        name: 'cyfirmaview',
        displayName: 'Cyfirma View',
        active: true,
      },
      {
        name: 'article',
        displayName: 'Article',
        active: true,
      },
      {
        name: 'manageioc',
        displayName: 'Manage IOC',
        active: true,
      },
      {
        name: 'online-reports-new',
        displayName: 'Online Report-New',
        active: true,
      },
      // ,
      // {
      //   'name': 'clientfeed',
      //   'displayName': 'Client Feed',
      //   'active': true
      // }
    ];
    this.menuItem.cyberEducation = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
      {
        name: 'emailTemplate',
        displayName: 'Email Template',
        active: true,
      },
      {
        name: 'target',
        displayName: 'Target',
        active: true,
      },
      {
        name: 'targetGroup',
        displayName: 'Target Group',
        active: true,
      },
      {
        name: 'mailProfile',
        displayName: 'Mail Profile',
        active: true,
      },
      {
        name: 'landingPage',
        displayName: 'Landing Page',
        active: true,
      },
      {
        name: 'attachments',
        displayName: 'Attachment',
        active: true,
      },
      {
        name: 'customForm',
        displayName: 'Custom Forms',
        active: true,
      },
      {
        name: 'campaign',
        displayName: 'Campaign',
        active: true,
      },
      {
        name: 'training',
        displayName: 'Training',
        active: true,
      },
    ];
    this.menuItem.core = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
      {
        name: 'blog',
        displayName: 'Blog',
        active: false,
      },
      {
        name: 'clientIncidents',
        displayName: 'Client Incidents',
        active: true,
      },
      {
        name: 'currentSnapshot',
        displayName: 'Current Snapshot',
        active: false,
      },
      {
        name: 'cwe',
        displayName: 'CWE',
        active: false,
      },
      {
        name: 'cyberAttacks',
        displayName: 'Cyber Attacks',
        active: true,
      },
      {
        name: 'cyberIncident',
        displayName: 'Cyber Incident',
        active: false,
      },
      {
        name: 'darkWeb',
        displayName: 'Dark Web',
        active: true,
      },
      {
        name: 'databreach',
        displayName: 'Databreach',
        active: true,
      },
      {
        name: 'databreachIpVulnerability',
        displayName: 'Databreach Vulnerability',
        active: false,
      },
      {
        name: 'exploit',
        displayName: 'Exploit',
        active: true,
      },
      {
        name: 'faq',
        displayName: 'FAQ',
        active: false,
      },
      {
        name: 'help',
        displayName: 'Help',
        active: false,
      },
      {
        name: 'malware',
        displayName: 'Malware',
        active: true,
      },
      {
        name: 'masterTags',
        displayName: 'Master Tags',
        active: true,
      },
      {
        name: 'masterApiList',
        displayName: 'Master API Details',
        active: true,
      },
      {
        name: 'phishing',
        displayName: 'Phishing',
        active: true,
      },
      {
        name: 'rss',
        displayName: 'Rss',
        active: false,
      },
      {
        name: 'recentCampaign',
        displayName: 'Recent Campaign',
        active: false,
      },
      {
        name: 'searchfeed',
        displayName: 'Search Feed',
        active: false,
      },
      {
        name: 'social',
        displayName: 'Social',
        active: true,
      },
      {
        name: 'threatActor',
        displayName: 'Threat Actor',
        active: true,
      },
      // {
      //   'name': 'learning',
      //   'displayName': 'Learning'
      // },
      {
        name: 'vulnerability',
        displayName: 'Vulnerability',
        active: true,
      },
      {
        name: 'digitalRiskApiResults',
        displayName: 'Digital Risk Master',
        active: false,
      },
      {
        name: 'iocAnalysis',
        displayName: 'IOC Manual Analysis',
        active: false,
      },
      {
        name: 'threatLandscapeMaster',
        displayName: 'Threat Landscape Master',
        active: false,
      },
      {
        name: 'ransomware',
        displayName: 'Ransomware',
        active: false,
      },
      {
        name: 'malicious',
        displayName: 'Malicious mobile apps',
        active: true,
      },
      {
        name: 'cloud-weakness',
        displayName: 'Cloud Weakness',
        active: false,
      },
      {
        name: 'domains-report',
        displayName: 'Domain Report',
        active: true,
      },
      {
        name: 'surface-web',
        displayName: 'Surface Web',
        active: true,
      },
      // {
      //   'name': 'reddit',
      //   'displayName': 'Reddit',
      //   'active': true
      // },
      // {
      //   'name': 'earlywarning',
      //   'displayName': 'Early Warning'
      // },
    ];
    this.menuItem.coreNew = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
      {
        name: 'blog',
        displayName: 'Blog',
        active: false,
      },
      {
        name: 'clientIncidents',
        displayName: 'Client Incidents',
        active: false,
      },
      {
        name: 'currentSnapshot',
        displayName: 'Current Snapshot',
        active: false,
      },
      {
        name: 'cwe',
        displayName: 'CWE',
        active: false,
      },
      {
        name: 'cyberAttacks',
        displayName: 'Cyber Attacks',
        active: true,
      },
      {
        name: 'cyberIncident',
        displayName: 'Cyber Incident',
        active: false,
      },
      {
        name: 'darkWeb',
        displayName: 'Dark Web',
        active: true,
      },
      {
        name: 'databreach',
        displayName: 'Databreach',
        active: true,
      },
      {
        name: 'databreachIpVulnerability',
        displayName: 'Databreach Vulnerability',
        active: false,
      },
      {
        name: 'exploit',
        displayName: 'Exploit',
        active: false,
      },
      {
        name: 'faq',
        displayName: 'FAQ',
        active: false,
      },
      {
        name: 'help',
        displayName: 'Help',
        active: false,
      },
      {
        name: 'malware',
        displayName: 'Malware',
        active: false,
      },
      {
        name: 'masterTags',
        displayName: 'Master Tags',
        active: true,
      },
      {
        name: 'masterApiList',
        displayName: 'Master API Details',
        active: true,
      },
      {
        name: 'phishing',
        displayName: 'Phishing',
        active: true,
      },
      {
        name: 'rss',
        displayName: 'Rss',
        active: false,
      },
      {
        name: 'recentCampaign',
        displayName: 'Recent Campaign',
        active: false,
      },
      {
        name: 'searchfeed',
        displayName: 'Search Feed',
        active: false,
      },
      {
        name: 'social',
        displayName: 'Social',
        active: true,
      },
      {
        name: 'threatActor',
        displayName: 'Threat Actor',
        active: false,
      },
      // {
      //   'name': 'learning',
      //   'displayName': 'Learning'
      // },
      {
        name: 'vulnerability',
        displayName: 'Vulnerability',
        active: false,
      },
      {
        name: 'digitalRiskApiResults',
        displayName: 'Digital Risk Master',
        active: false,
      },
      {
        name: 'threatLandscapeMaster',
        displayName: 'Threat Landscape Master',
        active: false,
      },
      {
        name: 'vulnerability-and-exploit',
        displayName: 'Vulnerability and Exploit',
        active: true,
      },
      {
        name: 'threat-actor-malware-and-campaign',
        displayName: 'Threat Actor, Malware and Campaign',
        active: true,
      },
      // {
      //   'name': 'help-and-support',
      //   'displayName': 'Help and Support',
      //   'active': true
      // },
      {
        name: 'report',
        displayName: 'Reports',
        active: true,
      },
      {
        name: 'attack-surface',
        displayName: 'Attack Surface',
        active: true,
      },
      {
        name: 'digital-risk',
        displayName: 'Digital Risk',
        active: true,
      },
      {
        name: 'master-scheduler',
        displayName: 'Master Scheduler',
        active: true,
      },
      {
        name: 'malicious',
        displayName: 'Malicious Mobile App',
        active: false,
      },
      {
        name: 'cloud-weakness',
        displayName: 'Cloud Weakness',
        active: false,
      },
      // {
      //   'name': 'export-user-data',
      //   'displayName': 'Export User Data',
      //   'active': true
      // },
      {
        name: 'domains-report',
        displayName: 'Domain Report',
        active: true,
      },
      {
        name: 'surface-web',
        displayName: 'Surface Web',
        active: true,
      },
      {
        name: 'client-threat-correlation',
        displayName: 'Client Threat Correlation',
        active: true,
      },
      {
        name: 'lolbas',
        displayName: 'Lolbas',
        active: false,
      },
      {
        name: 'confidential-file',
        displayName: 'Confidential File',
        active: false,
      },
      {
        name: 'piicii',
        displayName: 'PII CII',
        active: false,
      },
      // {
      //   'name': 'earlywarning',
      //   'displayName': 'Early Warning'
      // },

      {
        name: 'currentSnapshot',
        displayName: 'Current Snapshot',
        active: true,
      },
      {
        name: 'searchfeed',
        displayName: 'Search Feed',
        active: false,
      },
      {
        name: 'digitalRiskApiResults',
        displayName: 'Digital Risk Master',
        active: false,
      },
      {
        name: 'iocAnalysis',
        displayName: 'IOC Manual Analysis',
        active: false,
      },
      {
        name: 'threatLandscapeMaster',
        displayName: 'Threat Landscape Master',
        active: true,
      },

      // By Vishnu Avtar
      // {
      //   name: 'cap/org',
      //   displayName: 'All Organization Details',
      //   active: true,
      // },

      {
        name: 'orglist',
        displayName: 'All Organization Details',
        active: true,
      },

      {
        name: 'orglist1',
        displayName: 'All Organization Details',
        active: true,
      },
      {
        name: 'ransomware',
        displayName: 'Ransomware',
        active: false,
      },
    ];
    this.menuItem.situationalAwarenes = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];
    this.menuItem.riskScoring = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];
    this.menuItem.riskMonitoring = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];
    this.menuItem.threatVisibility = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];
    this.menuItem.incidentAnalytics = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];
    this.menuItem.vulnerabilityAnalytics = [
      {
        name: 'dashboard',
        displayName: 'Dashboard',
        active: true,
      },
    ];

    // tslint:disable-next-line: max-line-length
    this.vulComment = `Use asset classification, as well as system availability and data sensitivity attributes along with the external threat data provided in preceding section to prioritize the vulnerability mitigation efforts. Potential business impact and the probability that a vulnerability will be exploited should determine the risk posed by an unpatched system.
    <br />Mitigation activity must be tracked, and situations in which there has been a formal decision not to mitigate must be documented. Such practices improve the vulnerability management and prove helpful during audits and regulatory enquiries in showing due diligence.
    <br />Perform periodic vulnerability scans and commission external penetration testing exercises to detect
    computer system, network or Web application to find vulnerabilities that an attacker could exploit.
    <br />Invest in temporary shielding capabilities for critical systems. Such capabilities enable the
    automated invocation of firewall, system configuration or administration policies that protect vulnerable systems and applications until the vulnerability can be mitigated.`;

    this.snapshotConfig = [
      {
        name: 'vulnerability',
        title: 'Vulnerability related to your assets',
        icon: 'CYFIRMA_vulnerability.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'phishing',
        title: 'Phishing Attacks',
        icon: 'CYFIRMA_phishing.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'news',
        title: 'NEWS/INCIDENTS/BREACHES',
        icon: 'CYFIRMA_icon_News.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'digitalRisk',
        title: 'Digital Risk/Brand Risk',
        icon: 'CYFIRMA_digital risk.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'threatActor',
        title: 'Threat Actors',
        icon: 'CYFIRMA_icon_Threat Actor.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'darkWeb',
        title: 'Dark Web',
        icon: 'CYFIRMA_dark web.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'malwareAttack',
        title: 'Prevailing Malware Attacks',
        icon: 'CYFIRMA_icon_Malware.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'threatLandscape',
        title: 'Threat Landscape',
        icon: 'CYFIRMA_icon_Browser.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'recommendations',
        title: 'Recommendations',
        icon: 'CYFIRMA_icon_Brand.png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
      {
        name: 'earlyWarnings',
        title: 'Latest Early Warning',
        icon: 'CYFIRMA_icon_Early (option2).png',
        active: true,
        analyst: false,
        system: false,
        keyword: false,
        keywords: [],
      },
    ];
  }

  uploadFile(formData: any): Observable<HttpResponse<any>> {
    return this.http.post(SERVER_API_URL + 'cyberedu/api/targets/upload', formData, { observe: 'response' });
  }
  getPdfFile(url: any) {
    return this.http.get(url, { responseType: 'blob' });
  }
  getMenuItems(key: string) {
    return this.menus[key];
  }
  getQuickDateOptions(option?: string): any[] {
    if (option && option === 'no-custom-date') {
      return this.dateOptions.filter(_date => _date.value !== 'customDate');
    }
    return this.dateOptions;
  }
  getQuickDateOptionsRiskView(): any[] {
    return this.dateOptionsRiskView;
  }
  getModules(): Array<any> {
    return this.modules;
  }
  // color range from D3
  getColorScheme(): string[] {
    return this.colorPlate;
  }
  getPieChartConfig(title?: string, value?: string) {
    const config = {
      type: 'pie',
      theme: 'light',
      valueField: value ? value : 'value',
      titleField: title ? title : 'key',
      outlineAlpha: 0.5,
      depth3D: 0,
      balloonText: '[[title]]<br><span class="fs14"><b>[[value]]</b> ([[percents]]%)</span>',
      fontFamily: 'Roboto',
      angle: 0,
      labelsEnabled: true,
      autoDisplay: true,
      autoResize: true,
      autoMargins: false,
      marginRight: 0,
      marginTop: 15,
      marginBottom: 15,
      marginLeft: 0,
      innerRadius: '60%',
      pullOutRadius: 0,
      processTimeout: 1,
      export: {
        enabled: true,
      },
    };
    return config;
  }
  getSerialChart(type: string, booleanText?: string, rotate?: boolean | string, fields?: any) {
    const chart: any = {};
    if (type === 'trends') {
      chart.config = {
        type: 'serial',
        theme: 'light',
        marginRight: 10,
        marginTop: 17,
        autoMarginOffset: 20,
        valueAxes: [
          {
            logarithmic: true,
            dashLength: 1,
            guides: [
              {
                dashLength: 6,
                inside: true,
                label: 'average',
                lineAlpha: 1,
                value: 90.4,
              },
            ],
            position: 'left',
          },
        ],
        graphs: [
          {
            bullet: 'round',
            id: 'g1',
            balloonText: booleanText,
            bulletBorderAlpha: 1,
            bulletColor: '#FFFFFF',
            bulletSize: 7,
            lineThickness: 2,
            title: fields.valueFiled ? fields.valueFiled : 'value',
            type: 'smoothedLine',
            lineColor: '#3180d9',
            negativeLineColor: '#17a2b8',
            useLineColorForBulletBorder: true,
            valueField: fields.valueFiled ? fields.valueFiled : 'value',
          },
        ],
        chartScrollbar: {},
        chartCursor: {
          valueLineEnabled: true,
          valueLineBalloonEnabled: false,
          valueLineAlpha: 0.5,
          fullWidth: true,
          cursorAlpha: 0.05,
        },
        fontFamily: 'Roboto',
        categoryField: fields.categoryField ? fields.categoryField : 'date',
        categoryAxis: {
          parseDates: true,
        },
        export: {
          enabled: true,
        },
      };
    }
    if (type === 'bar') {
      if (Object.keys(fields).length <= 0) {
        fields = {};
      }
      chart.config = {
        theme: 'light',
        type: 'serial',
        graphs: [
          {
            balloonText: booleanText,
            fillColorsField: 'color',
            fillAlphas: 1,
            lineAlpha: 0.01,
            title: 'id',
            type: 'column',
            valueField: fields.valueFiled ? fields.valueFiled : 'count',
          },
        ],
        depth3D: fields.depth3D ? fields.depth3D : 0,
        angle: fields.angle ? fields.angle : 0,
        rotate: rotate ? true : false,
        categoryField: fields.categoryField ? fields.categoryField : 'id',
        fontFamily: 'Roboto',
        color: '#000',
        categoryAxis: {
          gridPosition: 'start',
          fillAlpha: 1,
          gridAlpha: 0.05,
          inside: false,
          position: 'right',
          labelRotation: 0,
        },
        valueAxis: {
          gridAlpha: 0.05,
        },
        export: {
          enabled: false,
        },
      };
    }
    return chart.config;
  }
  // generate word/tag cloud config
  getWorldChartConfig() {
    const config = {
      type: 'map',
      theme: 'none',
      projection: 'miller',
      imagesSettings: {
        rollOverColor: '#089282',
        rollOverScale: 3,
        selectedScale: 3,
        selectedColor: '#089282',
        color: '#13564e',
      },
      areasSettings: {
        unlistedAreasColor: '#15A892',
      },
      dataProvider: {},
    };
    return config;
  }
  // generate wordmap config
  getWordMap(mapData: any, config?: any) {
    // get min and max values
    const minBulletSize = config.minBulletSize;
    const maxBulletSize = config.maxBulletSize;
    let min = Infinity;
    let max = -Infinity;
    for (let index = 0; index < mapData.length; index++) {
      // const mapDataValue: number;
      const mapDataValue: number = mapData[index].value;
      if (mapDataValue < min) {
        min = mapDataValue;
      }
      if (mapDataValue > max) {
        max = mapDataValue;
      }
    }
    // it's better to use circle square to show difference between values, not a radius
    const maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
    const minSquare = minBulletSize * minBulletSize * 2 * Math.PI;
    // create circle for each country
    const images = [];
    for (let i = 0; i < mapData.length; i++) {
      const dataItem = mapData[i];
      const value = dataItem.value;
      // calculate size of a bubble
      let square = ((value - min) / (max - min)) * (maxSquare - minSquare) + minSquare;
      if (square < minSquare) {
        square = minSquare;
      }
      const size = Math.sqrt(square / (Math.PI * 2));
      // const id = dataItem.code;
      images.push({
        type: 'circle',
        theme: 'light',
        width: size,
        height: size,
        color: config.bulletColor, // dataItem.color,
        longitude: 77,
        latitude: 20,
        title: dataItem.name,
        value,
      });
    }
    // build map
    const mapConfig = {
      type: 'map',
      projection: 'equirectangular', // 'miller',
      areasSettings: {
        unlistedAreasColor: config.mapBgColor ? config.mapBgColor : '#ccc',
        // 'unlistedAreasAlpha': 0.1,
      },
      dataProvider: {
        map: 'worldLow',
        images,
      },
      export: {
        enabled: false,
      },
    };
    return mapConfig;
  }
  // get snapshot initial configuration
  getSnapConfig(): SnapShotConfig[] {
    return this.snapshotConfig.map(_se => Object.assign({}, _se)); // shallow copy of object
  }
  // generate gauge chart/speedometer
  getGaugeChart(config: any, selectedColor?: string) {
    const gaugeConfig: any = {
      theme: 'light',
      type: 'gauge',
      axes: [
        {
          topTextFontSize: 20,
          topTextYOffset: 30,
          axisColor: '#acabab26',
          axisThickness: 1,
          endValue: 10,
          gridInside: true,
          inside: false,
          radius: '85%',
          valueInterval: 10,
          tickColor: '#acabab26',
          startAngle: -90,
          endAngle: 90,
          unit: '%',
          bandOutlineAlpha: 0,
          bands: [],
          labelsEnabled: false,
        },
      ],
      arrows: [
        {
          alpha: 1,
          innerRadius: '35%',
          nailRadius: 0,
          radius: '140%',
          borderAlpha: 0,
          // 'color': selectedColor
        },
      ],
      fontFamily: 'Roboto',
    };
    // const bandSectdion: any = {
    //   'color': config.bandColor,
    //   'endValue': 0,
    //   'innerRadius': config.innerRadius ? config.innerRadius : '107%',
    //   'radius': config.radius ? config.radius : '140%',
    //   'gradientRatio': [0.5, 0, -0.5],
    //   'startValue': 0
    // };
    for (let i = 0; i < 10; i += 1) {
      const bandSection: any = {};
      bandSection.color = config.bandColor;
      (bandSection.startValue = i),
        (bandSection.innerRadius = config.innerRadius ? config.innerRadius : '107%'),
        (bandSection.radius = config.radius ? config.radius : '140%'),
        (bandSection.gradientRatio = [0.5, 0, -0.5]),
        (bandSection.startValue = i);
      bandSection.endValue = i + 1;
      gaugeConfig.axes[0].bands.push(bandSection);
    }
    const bandSectionL: any = {};
    bandSectionL.color = selectedColor;
    (bandSectionL.startValue = 0),
      (bandSectionL.endValue = 0),
      (bandSectionL.innerRadius = config.innerRadius ? config.innerRadius : '107%'),
      (bandSectionL.radius = config.radius ? config.radius : '140%'),
      (bandSectionL.gradientRatio = [0.5, 0, -0.5]),
      gaugeConfig.axes[0].bands.push(bandSectionL);
    return gaugeConfig;
  }
  getGaugeChartConfig(type: string, config?: any): any {
    if (type === 'default') {
      return {
        theme: 'light',
        type: 'gauge',
        axes: [
          {
            topTextFontSize: 20,
            topTextYOffset: 40,
            axisColor: '#31d6ea',
            axisThickness: 1,
            endValue: 10,
            gridInside: true,
            inside: true,
            radius: '50%',
            valueInterval: 10,
            tickColor: '#67b7dc',
            startAngle: -90,
            endAngle: 90,
            unit: '',
            bandOutlineAlpha: 0,
            bands: [
              {
                color: '#FFFF00',
                endValue: 10,
                innerRadius: '115%',
                radius: '180%',
                gradientRatio: [0.5, 0, -0.5],
                startValue: 0,
              },
              {
                color: '#F44336' /* marked area*/,
                endValue: 0,
                innerRadius: '115%',
                radius: '180%',
                gradientRatio: [0.5, 0, -0.5],
                startValue: 0,
              },
            ],
          },
        ],
        arrows: [
          {
            alpha: 1,
            innerRadius: '35%',
            nailRadius: 0,
            radius: '170%',
          },
        ],
      };
    }
  }
  getD3ColorScale(): any {
    return this.fillScale;
  }
  // exportAsPdf(id, saveAs) {
  //   // const htmlContainer: HTMLElement = document.getElementById(id);
  //   // html2canvas(htmlContainer).then((canvas) => {
  //   //   // Few necessary setting options
  //   //   const imgWidth = 200;
  //   //   const imgHeight = canvas.height * imgWidth / canvas.width;

  //   //   const contentDataURL = canvas.toDataURL('image/png');
  //   //   const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //   //   const position = 0;
  //   //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //   //   pdf.save(`${saveAs}.pdf`); // Generated PDF
  //   // });
  // }

  // get keywords search list
  getKeywordsOptions(moduleName: string) {
    return this.keywordSearch[moduleName];
  }

  getVulerComment() {
    return this.vulComment;
  }

  closeAllOpenDialog() {
    this.dcs.closeMatDialog(this.dialog, true);
    // this.dialog.closeAll();
  }
  // search keywords
  searchKeywords(key: string, searchedItem: string, moduleName?: string, dialogCalled = false, data?: any) {
    if (dialogCalled) {
      this.dcs.closeMatDialog(this.dialog, true);
      // this.dialog.closeAll();
      setTimeout(() => this.loadAttributes(key, searchedItem, moduleName, dialogCalled, data), 300);
    } else {
      this.loadAttributes(key, searchedItem, moduleName, dialogCalled, data);
    }
  }
  loadAttributes(key: string, searchedItem: string, moduleName?: string, dialogCalled = true, data?: any): any {
    const req: any = {
      search: searchedItem,
    };
    if (moduleName) {
      this.tagDetails.module = moduleName;
    } else {
      moduleName = key === 'Phishing' ? '' : 'TVI';
    }
    const vulnerability = {
      id: searchedItem,
      category: 'vulnerability',
    };
    const exploit = {
      id: searchedItem,
      category: 'exploits',
    };
    const actionData: any = { action: key, label: searchedItem, module: moduleName };
    const malware = {
      name: searchedItem,
      category: 'Malware',
    };
    switch (key) {
      case 'IP':
      case 'IPS':
      case 'IP Address':
        key = 'IP';
        this.dcs.setAjexStatus(true);
        this.ctds.searchByIPs(req).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res.body.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(IocComponent, {
                width: this.dialogConfig.width,
                height: this.dialogConfig.height,
                maxWidth: this.dialogConfig.maxWidth,
                disableClose: true,
                data: { action: key, label: searchedItem, data: res.body },
                panelClass: 'slide-ltr',
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Domain':
      case 'DOMAIN':
      case 'HOST':
      case 'HOSTNAME':
        key = 'Domain';
        this.dcs.setAjexStatus(true);
        this.ctds.searchByDomains(req).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res.body.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(IocComponent, {
                width: this.dialogConfig.width,
                height: this.dialogConfig.height,
                maxWidth: this.dialogConfig.maxWidth,
                disableClose: true,
                data: { action: key, label: searchedItem, data: res.body },
                panelClass: 'slide-ltr',
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'URL':
        this.dcs.setAjexStatus(true);
        this.ctds.searchByURls(req).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res.body.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(IocComponent, {
                width: this.dialogConfig.width,
                height: this.dialogConfig.height,
                maxWidth: this.dialogConfig.maxWidth,
                disableClose: true,
                data: { action: key, label: searchedItem, data: res.body },
                panelClass: 'slide-ltr',
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'MD5':
        this.dcs.setAjexStatus(true);
        this.ctds.searchByMD5(req).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res.body.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(IocComponent, {
                width: this.dialogConfig.width,
                height: this.dialogConfig.height,
                maxWidth: this.dialogConfig.maxWidth,
                disableClose: true,
                data: { action: key, label: searchedItem, data: res.body },
                panelClass: 'slide-ltr',
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Hash':
      case 'SHA':
      case 'File Hash':
        key = 'SHA';
        this.dcs.setAjexStatus(true);
        this.ctds.searchBySHA(req).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res.body.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(IocComponent, {
                width: this.dialogConfig.width,
                height: this.dialogConfig.height,
                maxWidth: this.dialogConfig.maxWidth,
                disableClose: true,
                data: { action: key, label: searchedItem, data: res.body },
                panelClass: 'slide-ltr',
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Threat Actor':
      case 'threat actor':
      case 'IOA':
        this.dcs.setAjexStatus(true);
        if (dialogCalled) {
          this.openThreatActor(key, searchedItem);
        } else {
          this.openThreatActor(key, searchedItem, data);
        }
        break;
      case 'Incidents':
        if (moduleName === 'SA') {
          this.router.navigate(['cap/situational/dashboard', 'List'], { queryParams: { type: 'incidents', incidents: req.search } });
        }
        if (moduleName === 'TVI') {
          this.router.navigate(['cap/cyber-threat/dashboard', 'List'], { queryParams: { type: 'incidents', incidents: req.search } });
        }
        if (moduleName === 'CIA') {
          this.router.navigate(['cap/cyber-incident/dashboard', 'List'], { queryParams: { type: 'incidents', incidents: req.search } });
        }
        break;
      case 'Vulnerability':
        if (moduleName === 'SA') {
          this.router.navigate(['cap/keyword-search'], { queryParams: { type: 'vulnerability', search: req.search, module: moduleName } });
        }
        if (moduleName === 'TVI') {
          this.router.navigate(['cap/keyword-search'], { queryParams: { type: 'vulnerability', search: req.search, module: moduleName } });
        }
        if (moduleName === 'CIA') {
          this.router.navigate(['cap/keyword-search'], { queryParams: { type: 'vulnerability', search: req.search, module: moduleName } });
        }
        if (moduleName === 'CVA') {
          this.router.navigate(['cap/vulnerability/dashboard', 'List'], {
            queryParams: { type: 'vulnerability', vulnerability: req.search },
          });
        }
        break;
      case 'Exploit':
        this.router.navigate(['cap/keyword-search'], { queryParams: { type: 'exploits', search: req.search, module: moduleName } });
        this.closeAllOpenDialog();
        // if (moduleName === 'SA') {
        //   this.router.navigate(['cap/situational/dashboard', 'List'], { queryParams: { type: 'exploits', search: req.search } });
        // }
        // if (moduleName === 'TVI') {
        //   this.router.navigate(['cap/cyber-threat/dashboard', 'list'], { queryParams: { type: 'exploits', search: req.search, searchVulExplKey: 'searchVulExpl' } });
        // }
        // if (moduleName === 'CIA') {
        //   this.router.navigate(['cap/cyber-incident/dashboard', 'List'], { queryParams: { type: 'exploits', exploits: req.search } });
        // }
        break;
      case 'CVE':
      case 'VULNERABILITY':
        // const vulnerability = {
        //   'id': searchedItem,
        //   'category': 'vulnerability'
        // };
        this.dcs.setAjexStatus(false);
        this.dialog.open(CommonVulnerabilityDetailsComponent, {
          width: this.dialogConfig.width,
          height: this.dialogConfig.height,
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: key, label: searchedItem, data: vulnerability },
          panelClass: 'slide-ltr',
        });
        break;
      case 'EXPLOIT':
        this.dcs.setAjexStatus(false);
        this.dialog.open(CommonVulnerabilityDetailsComponent, {
          width: this.dialogConfig.width,
          height: this.dialogConfig.height,
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: key, label: searchedItem, data: exploit },
          panelClass: 'slide-ltr',
        });
        break;
      case 'Phishing':
        if (moduleName === 'SA') {
          alert('Situational Awareness do not have phishing search features');
          // this.router.navigate(['situational/dashboard', 'List'], { queryParams: { type: 'vulnerability', vulnerability: req.search } });
        }
        if (moduleName === 'TVI') {
          this.router.navigate(['cap/cyber-threat/dashboard', 'List'], { queryParams: { type: 'phishing', url: searchedItem } });
        }
        if (moduleName === 'CIA') {
          this.router.navigate(['cap/cyber-incident/dashboard', 'List'], { queryParams: { type: 'phishing', url: searchedItem } });
        }
        if (!moduleName) {
          if (searchedItem) {
            const pageReq = {
              page: 0,
              size: 1,
              sort: ['id,DESC'],
            };
            const reqObj = {
              url: searchedItem,
            };
            this.dcs.setAjexStatus(true);
            this.corePhishingService.getPhishingsByURL(reqObj, pageReq).subscribe(
              (res: any) => {
                this.dcs.setAjexStatus(false);
                if (res.body.length) {
                  this.phishing = res.body[0];
                }
                this.dialog.open(PhishingDetailsComponent, {
                  width: this.dialogConfig.width,
                  height: this.dialogConfig.height,
                  maxWidth: this.dialogConfig.maxWidth,
                  disableClose: true,
                  data: { action: 'Phishing', label: 'Phishing', data: this.phishing },
                  panelClass: 'slide-ltr',
                });
              },
              (res: HttpErrorResponse) => this.onError(res.message)
            );
          }
        }
        break;
      case 'File':
        if (moduleName === 'TVI') {
          this.router.navigate(['cap/cyber-threat/dashboard', 'List'], { queryParams: { type: 'file', fileName: searchedItem } });
        }
        break;
      case 'Keywords':
        this.openTagView(req.search, true, 5, moduleName);
        break;
      case 'report':
        actionData.data = data ? data : {};
        this.dialog.open(ReportDialogComponent, {
          width: this.dialogConfig.width,
          height: this.dialogConfig.height,
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: actionData,
        });
        break;
      case 'Malware':
        this.dialog.open(MalwareComponent, {
          width: this.dialogConfig.width,
          height: this.dialogConfig.height,
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: 'Malware', label: 'Malware', data: malware },
          panelClass: 'slide-ltr',
        });
        break;
      case 'Campaign':
        if (moduleName === 'SA') {
          this.router.navigate(['cap/situational/dashboard', 'campaign-list'], { queryParams: { type: 'campaign', search: req.search } });
        } else if (moduleName === 'TVI') {
          this.router.navigate(['cap/keyword-search'], { queryParams: { type: 'campaign', search: req.search, module: 'tvi' } });
        } else {
          this.dialog.open(CampaignComponent, {
            width: this.dialogConfig.width,
            height: this.dialogConfig.height,
            maxWidth: this.dialogConfig.maxWidth,
            disableClose: true,
            data: { action: 'Campaign', label: 'Campaign', title: searchedItem },
            panelClass: 'slide-ltr',
          });
        }
        break;
      case 'correlation':
        this.dialog.open(CorrelationExpandedViewComponent, {
          width: '98%',
          height: '98%',
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: key, label: searchedItem, correlationData: data },
        });
        break;
      case 'CyfirmaResearch':
        this.dialog.open(CyfirmaResearchComponent, {
          width: this.dialogConfig.dWidth,
          height: 'auto',
          maxWidth: this.dialogConfig.maxWidth,
          disableClose: true,
          data: { action: key, label: searchedItem, cyfRsData: data },
          panelClass: 'slide-ltr',
        });
        break;
      default:
        return false;
    }
  }
  openTagView(tag: string, keyword?: boolean, days?: number, moduleName?: string) {
    if (this.tagSearchDialog) {
      this.tagSearchDialog.closeAll();
    }
    this.tagSearchDialog.open(TagSearchComponent, {
      width: this.dialogConfig.width,
      height: this.dialogConfig.height,
      maxWidth: this.dialogConfig.maxWidth,
      disableClose: true,
      data: { action: tag, label: 'Searched Tag', module: moduleName, keywordSearch: keyword, defaultDays: days },
      autoFocus: false,
      panelClass: 'slide-ltr',
    });
    // this.dcs.setAjexStatus(true);
    // const tagReq = {
    //   'searchTags': [tag],
    //   'keyword': true,
    //   'from': days ? this.dcs.getDayDiff(Number(days)).getTime() : null,
    //   'to': days ? new Date().getTime() : null
    // };
    // this.sads.getByTags(tagReq).subscribe((res) => {
    //   this.tagDetails.data = res.body;
    //   this.dcs.setAjexStatus(false);
    //   if (this.tagSearchDialog) {
    //     this.tagSearchDialog.closeAll();
    //   }
    //   this.tagSearchDialog.open(TagSearchComponent, {
    //     width: this.dialogConfig.width,
    //     height: this.dialogConfig.height,
    //     maxWidth: this.dialogConfig.maxWidth,
    //     disableClose: true,
    //     data: { action: tag, label: 'Searched Tag', module: this.tagDetails.module, data: this.tagDetails.data, keywordSearch: tagReq.keyword, defaultDays: days },
    //     autoFocus: false,
    //     panelClass: 'slide-ltr'
    //   });
    // }, (err: HttpErrorResponse) => this.onError(err));
  }
  openThreatActor(key: string, searchedItem: string, additionalInfo?: any) {
    this.ctds.searchByThreatActorName(searchedItem).subscribe(
      (res: any) => {
        this.dcs.setAjexStatus(false);
        const threatActorResponse = res.body[0];
        this.ctds.getCTIForThreatActor(searchedItem).subscribe(
          (res1: any) => {
            this.dcs.setAjexStatus(false);
            threatActorResponse.cti = res1.body;
            this.dialog.open(ThreatActorsComponent, {
              width: this.dialogConfig.width,
              height: this.dialogConfig.height,
              maxWidth: this.dialogConfig.maxWidth,
              disableClose: true,
              data: { action: key, label: searchedItem, data: threatActorResponse, methodInfo: additionalInfo },
              panelClass: 'slide-ltr',
            });
          },
          (err: any) => this.onError(err)
        );
      },
      (err: any) => this.onError(err)
    );
  }
  openThreatActorWithMethods(actorInfo: any) {
    this.openThreatActor(actorInfo.actor.key, actorInfo.actor.value, actorInfo.actorMethods);
  }
  openThreatStory(data: any, orgId: number) {
    if (!data.category) {
      if (
        data.newsCategory &&
        (data.newsCategory === 'Vulnerabilities and Exploits' || data.newsCategory === 'Vulnerability' || data.newsCategory === 'Exploits')
      ) {
        data['category'] = data.srcType;
      } else {
        data['category'] = data.type;
      }
      data['parentId'] = data.objectId;
    } else {
      data['parentId'] = data.parentId ? data.parentId : data.id ? data.id : data.objectId;
    }
    this.dialog.open(ThreatStoryComponent, {
      width: this.dialogConfig.width,
      height: this.dialogConfig.height,
      maxWidth: this.dialogConfig.maxWidth,
      disableClose: true,
      data: { category: data.category, categoryId: data.parentId, clientId: orgId },
      panelClass: 'slide-ltr',
    });
  }
  markSafe(data: any, prop: string, clientId?: number, type?: any, cb?: any): any {
    const dialogRef = this.dialog.open(MatDialogComponent, {
      width: '50%',
      height: '35%',
      disableClose: false,
      data: { action: 'API_FORM', safeComments: data.safeComments },
    });
    dialogRef.afterClosed().subscribe((result): any => {
      if (result.save) {
        this.dcs.setAjexStatus(true);
        const safeReq: MarkSafeReq = {
          orgId: clientId ?? 0,
          id: data.id,
          comment: result.safeComments,
          isSafe: data[prop],
        };
        if (type !== null && (type === 'compromisedUserDetails' || type === 'compromised-user-details')) {
          this.ctds.markSafeCompromisedUserDetails(safeReq).subscribe(
            (res: HttpResponse<any>) => {
              this.dcs.setAjexStatus(false);
              this.dialog.open(MatDialogComponent, {
                width: '50%',
                height: '50%',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
              });
              if(cb) {
                cb();
              }
              return true;
            },
            (err: HttpErrorResponse) => {
              data[prop] = !data[prop];
              this.onError(err);
            }
          );
        } else {
          this.ctds.markSafeDR(safeReq).subscribe(
            (res: HttpResponse<any>) => {
              this.dcs.setAjexStatus(false);
              this.dialog.open(MatDialogComponent, {
                width: '50%',
                height: '50%',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
              });
              return true;
            },
            (err: HttpErrorResponse) => {
              data[prop] = !data[prop];
              this.onError(err);
            }
          );
        }
      } else {
        data[prop] = !data[prop];
        return false;
      }
    });
  }
  openThreatStoryIOC(data: any, categoryName: any, orgId: number) {
    this.dialog.open(ThreatStoryComponent, {
      width: this.dialogConfig.width,
      height: this.dialogConfig.height,
      maxWidth: this.dialogConfig.maxWidth,
      disableClose: true,
      data: { category: categoryName, categoryId: data, clientId: orgId },
    });
  }
  // digital risk category details
  openDLDetails(_ld: any, config?: any, _category?: string): any {
    let _config: any = {};
    let category: any;
    if (config && Object.keys(config).length) {
      _config = config;
      category = _category;
    } else {
      const _SUBCATEGORY = _ld.subCategory ? _ld.subCategory.toLowerCase() : '';
      const _CATEGORY: string = _ld.category ? _ld.category.toLowerCase() : '';
      if (
        _CATEGORY === 'impersonation' ||
        _CATEGORY === 'brand_infringement' ||
        _CATEGORY === 'brand infringement' ||
        _CATEGORY === 'impersonation and infringement' ||
        _CATEGORY === 'executivepeople' ||
        _CATEGORY === 'productsolution'
      ) {
        _config = {
          category: 'impersonation',
          isExpanded: true,
          keys: {
            _common: ['riskRating', 'impact'], // 'isSafe'
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetName', 'assetType', 'masterCreatedAt', 'lastModifiedDate', 'postedDate'],
          },
        };
        _ld.postedDate = _ld.date;
        if (_CATEGORY === 'impersonation') {
          _config.keys = {
            _common: ['riskRating', 'impact'], // 'isSafe'
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetName', 'assetType', 'dnsA', 'masterCreatedAt', 'hostProvider', 'lastModifiedDate', 'dnsMx', 'threatActor'],
          };
          if (_SUBCATEGORY === 'domainitassets') {
            _config.keys._maps = [
              'assetName',
              'assetType',
              'dnsA',
              'masterCreatedAt',
              'date',
              'hostProvider',
              'lastModifiedDate',
              'dnsMx',
              'threatActor',
            ];
          } else if (_SUBCATEGORY === 'executivepeople') {
            _config.keys._maps = ['assetName', 'assetType', 'masterCreatedAt', 'postedDate', 'lastModifiedDate'];
          }
        } else if (_CATEGORY === 'brand infringement') {
          _config.keys = {
            _common: ['riskRating', 'impact', 'isSafe'],
            _optional: ['description', 'source', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetName', 'assetType', 'masterCreatedAt', 'lastModifiedDate', 'postedDate'],
          };
        } else {
          _config.keys = {
            _common: ['riskRating', 'impact'], // 'isSafe'
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetName', 'assetType', 'dnsA', 'masterCreatedAt', 'hostProvider', 'lastModifiedDate', 'dnsMx', 'threatActor'],
          };
        }
        category = 'impersonation';
      } else if (_CATEGORY === 'phishing' || _CATEGORY === 'ransomware' || _CATEGORY === 'darkweb' || _CATEGORY === 'data leak') {
        _config = {
          category: 'databreach',
          isExpanded: true,
          keys: {
            _common: ['riskRating', 'impact'],
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetValue', 'assetType', 'masterCreatedAt', 'lastModifiedDate'],
          },
        };
        if (_SUBCATEGORY === 'compromised-user-details') {
          _config.keys = {
            _common: ['impact'],
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments', 'title'],
            _maps: [
              'userName',
              'email',
              'name',
              'compromisedDomain',
              'password',
              'passhash',
              'phone',
              'breachDate',
              'masterCreatedAt',
              'lastModifiedDate',
            ],
          };
        }
        if (_CATEGORY === 'ransomware' || _SUBCATEGORY === 'ransomware') {
          _ld.publishedDate = _ld.date;
          _config.keys['_maps'].push('publishedDate');
        } else if (_CATEGORY === 'darkweb' || _CATEGORY === 'data leak' || _SUBCATEGORY === 'darkweb') {
          _ld.postedDate = _ld.date;
          _config.keys['_maps'].push('postedDate');
          _config.keys['_optional'] = ['breachedData', 'description', 'impact', 'recommendations', 'location', 'safeComments'];
        } else {
          _config.keys['_maps'].push('date');
        }
        category = 'dataBreach';
      } else if (
        _CATEGORY === 'social and public exposure' ||
        _CATEGORY === 'source_code' ||
        _CATEGORY === 'source code' ||
        _CATEGORY === 'sourcecode' ||
        _CATEGORY === 'source-code' ||
        _CATEGORY === 'piicii' ||
        _CATEGORY === 'confidential_files' ||
        _CATEGORY === 'confidential files' ||
        _CATEGORY === 'maliciousmobileapps' ||
        _CATEGORY === 'hacktivist'
      ) {
        _config = {
          category: 'social',
          isExpanded: true,
          keys: {
            _common: ['riskRating', 'impact'], // 'isSafe'
            _optional: ['description', 'impact', 'recommendations', 'location', 'safeComments'],
            _maps: ['assetName', 'assetType', 'masterCreatedAt', 'lastModifiedDate', 'postedDate'],
          },
        };
        _ld.postedDate = _ld.date;
        if (_CATEGORY === 'piicii' || _SUBCATEGORY === 'pii-cii') {
          _config.keys['_optional'].push('breachedData');
        } else if (
          _SUBCATEGORY === 'source_code' ||
          _SUBCATEGORY === 'source code' ||
          _SUBCATEGORY === 'sourcecode' ||
          _SUBCATEGORY === 'source-code'
        ) {
          _config.keys['_optional'].push('source');
        } else if (_CATEGORY === 'maliciousmobileapps' || _SUBCATEGORY === 'malicious-mobile-apps') {
          _ld.sourceUrl = _ld.url;
          _config.keys['_optional'].push('sourceUrl');
        }
        category = 'social';
      }
    }
    _config.keys['_notes'] = 'notes';
    const dheightList: any = { confidential_files: '72%', piicii: '72%' };
    const dialogRef = this.dialog.open(DigitalriskSectionPopupComponent, {
      width: this.dialogConfig.width,
      height:
        _ld.category &&
        (_ld.category.toLowerCase() === 'piicii' ||
          _ld.category.toLowerCase() === 'confidential_files' ||
          (_ld.subCategory && (_ld.subCategory.toLowerCase() === 'pii-cii' || _ld.subCategory.toLowerCase() === 'confidential files')))
          ? dheightList[_ld.category.toLowerCase()]
          : this.dialogConfig.height,
      maxWidth: this.dialogConfig.maxWidth,
      disableClose: true,
      data: { category, config: _config, data: _ld },
      panelClass: 'slide-ltr',
    });
    return dialogRef;
  }

  getMenus(moduleName: string): any {
    if (moduleName === 'all') {
      return this.menuItem;
    }
    return (this.menuItem as any)[moduleName];
  }
  // get core sub-module for normal users
  getCoreMenuForNonRootOrg() {
    const subModules = [
      {
        name: 'rss',
        displayName: 'Rss',
        active: true,
      },
      {
        name: 'social',
        displayName: 'Social',
        active: true,
      },
    ];
    return subModules;
  }

  // get s3base icons url::
  getS3BaseIconsUrl(version?: string): string {
    // if (version === 'latest') {
    //   return this.baseS3IconUrl1;
    // }
    return this.baseS3IconUrl1;
  }

  // copy content in curson
  copyContentOnCurson(className: string, index: number): void {
    document.body.style.cursor = 'copy';
    const _class = `.${className}` + index;
    const copyContext: any = document.querySelector(_class);
    copyContext.select();
    document.execCommand('copy');
  }
  // search, heighlight keyword in json format
  highlightText(str: string, search: string, replaceWith: string) {
    /* Define function for escaping user input to be treated as
      a literal string within a regular expression */
    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /* Define functin to find and replace specified term with replacement string */
    return str.replace(new RegExp(escapeRegExp(search), 'g'), replaceWith);
  }
  trackAndHeighlightKeywords(data: any, searchPatern: string, searchKeys?: string[]) {
    const srList: any[] = [];
    function highlightText(str: string, search: string, replaceWith: string) {
      /* Define function for escaping user input to be treated as
      a literal string within a regular expression */
      function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      /* Define functin to find and replace specified term with replacement string */
      return str.replace(new RegExp(escapeRegExp(search), 'gi'), replaceWith);
    }
    let sr: any = {};
    function searchAll(_data: any, _searchList: string[]) {
      let found = false;
      if (_searchList) {
        for (let slc = 0; slc <= _searchList.length; slc++) {
          const _sl = _searchList[slc];
          if (searchKeys!.indexOf(_searchList[slc]) > -1) {
            sr = {
              key: '',
              found: false,
              count: 0,
              id: null,
              description: '',
            };
            sr.key = _searchList[slc];
          }
          if (slc === _searchList.length) {
            if (found && sr) {
              return _data;
            } else {
              return;
            }
          }
          try {
            if (_data[_sl] && typeof _data[_sl] === 'string') {
              const str: string = _data[_sl];
              const newReg = new RegExp(searchPatern, 'i');
              if (str?.match(newReg)) {
                _data[_sl] = highlightText(_data[_sl], searchPatern, '<em class="heighlightd_txt">' + searchPatern + '</em>');
                sr.found = true;
                sr.count += 1;
                found = true;
                continue;
              } else {
                continue;
              }
            } else if (_data[_sl] && typeof _data[_sl] === 'object') {
              if (Array.isArray(_data[_sl])) {
                // check whether key is array or object
                if (_data[_sl].length) {
                  for (let i = 0; i <= _data[_sl].length; i++) {
                    if (_data[_sl][i] && typeof _data[_sl][i] === 'string') {
                      const str: string = _data[_sl][i];
                      const newReg = new RegExp(searchPatern, 'i');
                      if (str?.match(newReg)) {
                        _data[_sl][i] = highlightText(_data[_sl][i], searchPatern, '<em class="heighlightd_txt">' + searchPatern + '</em>');
                        sr.found = true;
                        sr.count += 1;
                        found = true;
                        continue;
                      } else {
                        continue;
                      }
                    } else if (_data[_sl][i] && typeof _data[_sl][i] === 'object') {
                      const _skObjKeys = Object.keys(_data[_sl][i]);
                      const iSearched = searchAll(_data[_sl][i], _skObjKeys);
                      if (iSearched) {
                        sr.id = iSearched.sectionId;
                        sr.description = _sl;
                        srList.push(sr);
                      }
                    } else {
                      continue;
                    }
                  }
                } else {
                  continue;
                }
              } else {
                const isearchKeys = Object.keys(_data[_sl]);
                if (isearchKeys?.length) {
                  const iSearched = searchAll(_data[_sl], isearchKeys);
                  if (iSearched) {
                    sr.id = iSearched.sectionId;
                    sr.description = _sl;
                    srList.push(sr);
                  }
                } else {
                  return;
                }
              }
            }
          } catch {
            console.warn('somthing wrong with data format:');
            return sr;
          }
        }
      }
    }
    if (searchKeys?.length) {
      const searched = searchAll(data, searchKeys);
      if (searched) {
        return srList;
      } else {
        const fl = srList.filter((ae, i, arr) => arr.findIndex(ae2 => Object.keys(ae2).every(prop => ae2[prop] === ae[prop])) === i);
        return fl;
      }
    } else {
      if (data) {
        const skeys = Object.keys(data);
        const searched = searchAll(data, skeys);
        if (searched) {
          return srList;
        } else {
          const fl = srList.filter((ae, i, arr) => arr.findIndex(ae2 => Object.keys(ae2).every(prop => ae2[prop] === ae[prop])) === i);
          return fl;
        }
      } else {
        console.log(data);
        return data;
      }
    }
  }
  // show api response status
  showApiStatus(_data: any) {
    this.dialog.open(MatDialogComponent, {
      width: '300px',
      height: '270px',
      disableClose: false,
      data: _data,
    });
  }
  // list view config
  getDispConfig(): any {
    const dispConfig = {
      noGeo: 'Global',
      noTech: 'ALL',
      unknown: 'Unknown',
      noData: 'No Records Found',
      notFound: 'Data is being processed',
      dataLoading: 'Data is being loading...',
      NA: '--',
      NAText: 'N/A',
      noAttrib: 'No Attribution Found',
      noRec: 'No Specific recommendations',
      inactiveIOC: 'The underlying data for this alert has changed, this alert either been remediated or not valid any more.',
      dateFormat: 'mediumDate',
      timeZone: '',
    };
    return dispConfig;
  }

  // Copy to Clipboard
  copyToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  getAttackSurfaceViewConfig(): any {
    const viewConfig = {
      attackSurfacen: {
        keys: {
          _common: ['riskRating', 'impact', 'isSafe'],
          _optional: ['location', 'safeComments'],
          _maps: [
            'subDomain',
            'ip',
            'subDomainCreatedDate',
            'lastModifiedDate',
            'createdDate',
            'software',
            'server',
            'siteStatusCode',
            'isEarlyWarningAsset',
          ],
          _notes: 'notes',
        },
        category: 'attackSurfacen',
        isExpanded: false,
        type: 'domain-ip-vulnerability',
        title: 'domainIPVulnerability',
      },
      attackSurfaceCertificates: {
        keys: {
          _common: ['riskRating', 'impact', 'isSafe'],
          _optional: ['certHash', 'location', 'safeComments'],
          _maps: ['subDomain', 'issuedBy', 'validFrom', 'validTo', 'status', 'createdDate', 'lastModifiedDate', 'version', 'selfSigned'],
          _notes: 'notes',
        },
        category: 'attackSurfaceCertificates',
        isExpanded: false,
        type: 'attackSurfaceCertificates',
        title: 'certificates',
      },
      attackSurfaceConfigurations: {
        keys: {
          _common: ['configRiskRating', 'impact', 'isDnsSafe'],
          _optional: ['location', 'dnsSafeComments'],
          _maps: ['domain', 'ip', 'subDomainCreatedDate', 'lastModifiedDate', 'createdDate', 'dnssec', 'expiryDate', 'missingEPPCodes', 'server', 'software' ],
          _extended: {
            _mailSecurity: ['spf', 'dmrc', 'openRelay', 'dkim'],
            _domainSecurity: ['zoneTranser'],
            _maps: [
              'strictTransportSecurity',
              'xssProtection',
              'secureCookie',
              'contentSecurityPolicy',
              'xframeOptions',
              'cookiexssProtection',
            ],
          },
          _notes: 'configNotes',
        },
        category: 'attackSurfaceConfigurations',
        isExpanded: false,
        type: 'attackSurfaceConfigurations',
        title: 'configurations',
      },
      attackSurfaceOpenport: {
        keys: {
          _common: ['openPortRiskRating', 'impact', 'isPortSafe'],
          _optional: ['ports', 'location', 'portSafeComments', 'portDescription'],
          _maps: ['subDomain', 'ip', 'subDomainCreatedDate', 'lastModifiedDate', 'createdDate', 'software', 'server'],
          _notes: 'openPortNotes',
        },
        category: 'attackSurfaceOpenport',
        isExpanded: false,
        type: 'attackSurfaceOpenport',
        title: 'openPorts',
      },
      attackSurfaceIPDomain: {
        keys: {
          _common: ['cyfirmaScore', 'impact', 'isSafe'],
          _optional: ['location', 'safeMarkComments', 'threatActors'],
          _maps: ['subDomain', 'ip', 'createdDate', 'lastModifiedDate', 'ipVersion', 'countryName', 'usageType', 'isp'],
          _notes: 'notes',
        },
        category: 'attackSurfaceIPDomain',
        isExpanded: false,
        type: 'attackSurfaceIPDomain',
        title: 'domainReputation',
      },
      attackSurfacecloundWeakness: {
        keys: {
          _common: ['riskRating', 'impact', 'isSafe'],
          _optional: ['description', 'impact', 'location', 'safeComments', 'recommendations'],
          _maps: ['source', 'assetName', 'masterCreatedAt', 'lastModifiedDate', 'assetType'],
          _notes: 'notes',
        },
        category: 'attackSurfacecloundWeakness',
        isExpanded: false,
        type: 'attackSurfacecloundWeakness',
        title: 'cloudWeakness',
      },
    };
    return viewConfig;
  }
  // convert date time object to local date time
  convertDateUtils(date: object, time?: any): string {
    let serverDate: any;
    if (time && Object.keys(time).length) {
      let hr = time.hour;
      if (hr < 10) {
        hr = '0' + hr;
      }
      let min = time.minute;
      if (min < 10) {
        min = '0' + min;
      }
      serverDate = this.dateUtils.convertLocalDateToServer(date) + 'T' + hr + ':' + min + ':' + '00';
      return serverDate;
    } else {
      serverDate = this.dateUtils.convertLocalDateToServer(date) + 'T' + '00' + ':' + '00' + ':' + '00';
      return serverDate;
    }
  }
  // escape html tags from string type
  stripHtmlTags(value: string | null) {
    if (value === null || value === '') {
      return false;
    } else {
      value = value.toString();
      return value.replace(/<[^>]*>/gi, '');
    }
  }
  onInactiveIOC(error: any): void {
    if (JSON.stringify(error) === '{}' || String(error.status) === '404') {
      this.dialog.open(MatDialogComponent, {
        width: '295px',
        height: '220px',
        disableClose: false,
        data: { action: 'API_WARNING', message: this.getDispConfig()['inactiveIOC'] },
      });
    }
  }
  private onError(error: any) {
    console.error(error);
    this.dcs.setAjexStatus(false);
    if (error.status === 403) {
      this.dialog.closeAll();
      this.dialog.open(MatDialogComponent, {
        width: '318px',
        height: '169px',
        disableClose: false,
        panelClass: 'msgpov',
        data: { action: 'MSGPOV', message: 'res.body.message' },
      });
    }
  }
}
