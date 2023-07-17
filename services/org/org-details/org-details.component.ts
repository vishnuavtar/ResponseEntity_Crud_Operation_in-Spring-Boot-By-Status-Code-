/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataCommunicationService, DataService, UserService } from '../../shared';
import { MatDialogComponent } from '../../shared/components';
import { OrgDialogComponent } from '../org-dialog/org-dialog.component';
import {
  OrgDetails,
  OrgUser,
  OrgAssets,
  Role,
  Org,
  OrgReportFrequency,
  OrgSubscription,
  OrgSubscriptionAudit,
  OrgAudit,
  OrgUserAudit,
  OrgAssetsAudit,
  OrgReportConfig,
  OrgAssetsTemp,
} from '../models';
import { OrgService } from '../org.service';
import { OrgAnalystService } from '../org-analyst.service';
import { CyberThreatDashboardService } from '../../cyber-threat/services/cyber-threat-dashboard.service';
import { FeedService } from '../../core/services/feed.service';
import { saveAs } from 'file-saver';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { JhiDateUtils, JhiEventManager } from 'ng-jhipster';
import { INTEGRATION_TYPE } from '../../app.constants';
import { Location } from '@angular/common';

import {
  OrgDetailsService,
  OrgAssetsService,
  OrgAssetsTempService,
  OrgUserService,
  RoleService,
  OrgReportFrequencyService,
  OrgReportRecipientService,
  OrgSubscriptionService,
  OrgReportConfigService,
  OrgSubscriptionAuditService,
} from '../org-details-service';
import { number, string } from '@amcharts/amcharts4/core';
import { PasswordResetInitService } from '../../account';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'jhi-org-details',
  templateUrl: './org-details.component.html',
  styleUrls: ['./org-details.component.scss'],
})
export class OrgDetailsComponent implements OnInit, OnDestroy {
  [x: string]: any;
  orgSubsForm!: FormGroup;
  public alertConfigForm!: FormGroup;
  sendEmailForm!: FormGroup;
  orgDetailsList!: any[];
  orgReportFrequencyList!: any[];
  orgReportRecipientsList!: any[];
  orgReportConfigList!: any[];
  orgAuditList!: any[];
  orgUserAuditList!: any[];
  orgAssetsList!: any[];
  orgAssetAuditList!: any[];
  accessLogList!: any[];
  searchAcessLogsList!: any[];
  dataBreachAssetsList!: any[];
  dataBreachAssetsTempList!: any[];
  orgUsersList!: any[];
  orgUsersCount: any;
  orgUserSingle: any;
  company: any;
  isalertConfigLoaded = false;
  alertConfigData: any = {};
  orgUsersDet: any = {
    orgUserLimit: number,
    orgUserCount: number,
  };
  dateReqIOC: any = {
    fromDate: null,
    toDate: null,
  };
  digitalRiskDelete!: boolean;
  digitalRiskTempDelete!: boolean;
  checkedAllDigitalRisk!: boolean;
  checkedAllTempDigitalRisk!: boolean;
  minDate: Date = new Date();
  digitalRiskIds: number[] = [];
  digitalRiskTempIds: any[] = [];
  monitor!: number;
  assetmonitor = 0;
  orgUserAnalysts: any[] = [];
  rolesList!: any[];
  orgSubscriptionList!: any[];
  // orgEditSubscriptionList: any = {};
  subscriptionActions: any = {
    edit: false,
    view: false,
    selectedModule: '',
    scale: false,
  };
  subs: any = {};
  params: any;
  page!: number;
  searchAssets!: string;
  searchOrgDetails!: string;
  searchReportTypes!: string;
  searchUsers!: string;
  searchCveStix!: string;
  searchThreatActor!: string;
  searchIndicatorType!: string;
  searchValue!: string;
  navigatorSubscription: Subscription;
  pagerSubscription: Subscription;
  apiStatusSubscription: Subscription;
  activeNavigatorNav!: string;
  orgBasicDetails: any = {};
  pagerInfo: any = {};
  fileStatus = 'Select File';
  files: any = File;
  isUrlFields!: boolean;
  returnValue!: boolean;
  extUrl!: string;
  orgId!: number;
  minStartDate: any = { year: new Date().getFullYear(), month: 1, day: 1 };
  analystsGroup = new FormControl();
  analystsGroup1 = new FormControl();
  salesGroup = new FormControl();
  salesGroup1 = new FormControl();
  preSalesGroup = new FormControl();
  preSalesGroup1 = new FormControl();
  clientFeedsType!: string;
  reports: any[] = [];
  fileData: any;
  modules!: any[];
  selectedKey: string;
  selectKey!: string;
  keys: string[] = ['All', 'Technology', 'Geography', 'Industry'];
  dataBreachAssetTypes!: any[];
  assetType: any;
  numericPattern = '^[0-9]+$';
  basicModules: string[] = [
    'Cyber Incident Analytics',
    'Threat Visibility and Intelligence',
    'Cyber Situational Awareness',
    'Cyber Education',
  ];
  subscriptionsModule: any = {};
  moduleIcons: any = {
    education: 'cyber_education.png',
    vulnerable: 'vulnerability.png',
    risk_scoring: 'risk_scoring.png',
    monitoring: 'brandindividual_riskmonitoring.png',
    situational: 'situational_awareness.png',
    threat_visibility: 'threatvisibility_analytics.png',
    incident_analytics: 'incident_analytics.png',
  };
  s3BaseImgUrl!: string;
  selectedSubscribedModule: any;
  loggedinUserDet: any = {};
  parentOrgId!: number;
  isRootOrg!: boolean;
  isDRDPremium!: boolean;
  stixXmlUrl!: string;
  stixJsonUrl!: string;
  stixThreatActorJsonUrl!: string;
  stixVulnerbilityJsonUrl!: string;
  stixVulnerbilityJson21Url!: string;
  stixVulnerbilityJson21Url1!: string;
  stixCompromisedUserDetailsJson21Url!: string;
  stixVulnerbilityJson21Html!: string;
  stixThreatIoc21Url!: string;
  sitxThreatActorJson21Url!: string;
  sitxThreatActorJson21Html!: string;
  searchThreatIocJson21Url!: string;
  taxiiXmlUrl!: string;
  stixalertsjsonurl!: string;
  stixriskdossierjsonurl!: string;
  exploitalertsjsonurl!: string;
  attacksurfacealertsjsonurl!: string;
  certificateAlertsJsonUrl!: string;
  PhishingJsonUrl!: string;
  alertVulnerabilityUrl!: string;
  ipWithVulnerabilityUrl!: string;
  dataleakJsonUrl!: string;
  brandInfrigementUrl!: string;
  impdatadiscoverUrl!: string;
  attacksurfacedatadiscoverUrl!: string;
  certificatedatadiscoverUrl!: string;
  dataleakdatadiscoverUrl!: string;
  brandInfrigementdatadiscoverUrl!: string;
  ipWithVulnerabilitydatadiscoverUrl!: string;
  vulnerabilitydatadiscoverUrl!: string;
  exploitadatadiscoverurl!: string;
  PhishingdatadiscoverUrl!: string;
  malwaredatadiscoverUrl!: string;
  campaigndatadiscoverUrl!: string;
  openportjsonurl!: string;
  ipvulnerajsonurl!: string;
  cofigurationjsonurl!: string;
  cloudWeaknessjsonurl!: string;
  ipreputionjsonurl!: string;
  certificatejsonurl!: string;
  domainItAssetsjsonurl!: string;
  excutivePeoplejsonurl!: string;
  productSolutionjsonurl!: string;
  socalHendlerjsonurl!: string;
  phishingjsonurl!: string;
  ransomwarejsonurl!: string;
  darkwebjsonurl!: string;
  sourceCodejsonurl!: string;
  maliciousMobileAppsjsonurl!: string;
  confidentialFilesjsonurl!: string;
  pIICIIjsonurl!: string;
  iocOrgCsv: any = {
    org24hrs: string,
    orgAll: string,
  };
  iocCsv!: string;
  selectedAuditIndex!: number;
  selectedConfigIndex!: number;
  snapshotConfigList!: any[];
  selectedConfigKeywords: any = {};
  private configObjectId!: string;
  feedsTypes!: any[];
  clientsFeeds: any[] = [];
  searchClientSource!: string;
  orgs!: any[];
  selectedClient!: number;
  // new layout initialization
  dispConfig: any = {};
  orgTopNav: any[] = [
    { name: 'Basic Details', id: 'bd', active: true, ac: true },
    { name: 'Users', id: 'users', active: true, ac: false },
    { name: 'Assets', id: 'assets', active: true, ac: false },
    { name: 'Digital Risk Keywords', id: 'drk', active: true, ac: false },
    { name: 'Digital Risk Keywords (Temp)', id: 'drk-temp', active: false, ac: false },
    { name: 'API', id: 'api', active: true, ac: false },
    { name: 'Audit', id: 'audit', active: true, ac: false },
    { name: 'Digital Risk Discovery', id: 'drd', active: false, ac: false },
    { name: 'DRD Company', id: 'drd-company', active: false, ac: false },
    { name: 'Domain Keywords', id: 'drd-dk', active: false, ac: false },
    { name: 'Alerts Config', id: 'alertsConfig', active: true, ac: false },
  ];
  sot = 'Basic Details';
  sci = 0;
  enableEdit: any = {
    analyst: false,
    sales: false,
    presales: false,
  };
  apiST = 'apiKeys';
  searchDomain!: '';
  searchCompany!: '';
  searchDomainKeywords!: '';
  drdDomains!: any[];
  drdCompany!: any[];
  drdKeywordDomains!: any[];
  drdSDKeywords!: any[];
  selectedDomain: any = {};
  drdKWAssetType!: string;
  drdKWAssetTypes: string[] = [];
  iocsStixXMLShowHide = true;
  iocsStixJSONShowHide = true;
  iocsStix2xJSONShowHide = true;
  threatActorStix1xJSONShowHide = true;
  threatActorStix2xJSONShowHide = true;
  VulnerabilityStix1xJSONShowHide = true;
  VulnerabilityStix2xJSONShowHide = true;
  alertsstxjsonShowHide = true;
  clickAllDigitalRisk = false;
  clickAllDigitalRiskTemp = false;
  selectedAPI!: string;
  sampleXML: any;
  auditDownloadShowHide = false;
  fromDate!: Date | null;
  toDate!: Date | null;
  emailId: any = '';
  isEmailChecked = false;
  isAnalyst!: boolean;
  orgCSList: string[] = [];
  xml: any =
    // tslint:disable-next-line: max-line-length
    `<stix:STIX_Package xmlns="http://xml/metadataSharing.xsd" xmlns:AddressObj="http://cybox.mitre.org/objects#AddressObject-2" xmlns:Cyfirma="https://www.cyfirma.com/" xmlns:URIObj="http://cybox.mitre.org/objects#URIObject-2" xmlns:cybox="http://cybox.mitre.org/cybox-2" xmlns:cyboxCommon="http://cybox.mitre.org/common-2" xmlns:indicator="http://stix.mitre.org/Indicator-2" xmlns:stix="http://stix.mitre.org/stix-1" xmlns:stixCommon="http://stix.mitre.org/common-1" id="Cyfirma:package-d1e39855-ff2d-47de-b91e-3c724cbe67bc" timestamp="2020-10-04T06:02:16.208Z" version="1.2">
<stix:STIX_Header>
	<stix:Description>Threat IOC</stix:Description>
</stix:STIX_Header>
<stix:Indicators>` +
    // tslint:disable-next-line:max-line-length
    `<stix:Indicator xmlns="" xmlns:ns141="http://xml/metadataSharing.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="indicator-d95df6bb-f0ea-400d-b4f2-72901375f3c1" timestamp="2020-10-04T06:02:16.208Z" xsi:type="indicator:IndicatorType">
		<indicator:Title>Malicious IPv4 Indicator</indicator:Title>
		<indicator:Description/>
		<indicator:Observable id="observable-f18b62c1-2b88-490d-827b-8d8b09a2f478">
			<cybox:Object id="ip-5027cd60-e09f-4a35-b884-717afa26fe4a">
				<cybox:Properties xsi:type="AddressObj:AddressObjectType">
					<AddressObj:Address_Value>192.243.56.76</AddressObj:Address_Value>
				</cybox:Properties>
			</cybox:Object>
		</indicator:Observable>
		<indicator:Producer>
			<stixCommon:Identity>
				<stixCommon:Name>Cyfirma</stixCommon:Name>
			</stixCommon:Identity>
			<stixCommon:Time>
				<cyboxCommon:Produced_Time>2020-10-04T06:02:16.208Z</cyboxCommon:Produced_Time>
			</stixCommon:Time>
		</indicator:Producer>
	</stix:Indicator>
</stix:Indicators>
</stix:STIX_Package>`;
  jsonData: any = [
    {
      observables: null,
      indicators: {
        indicators: [],
      },
      exploitTargets: null,
      incidents: null,
      coursesOfAction: null,
      campaigns: null,
      threatActors: null,
      reports: null,
      relatedPackages: null,
      id: '{https://www.cyfirma.com/}package-6a445526-98ce-4d99-8ebd-6fcffa086128',
      idref: null,
      timestamp: '2020-09-30T08:23:33.945+0000',
      version: '1.2',
      stixheader: {
        title: null,
        packageIntents: [],
        descriptions: [
          {
            value: 'Threat IOC',
            id: null,
            ordinality: null,
            structuringFormat: null,
          },
        ],
        shortDescriptions: [],
        profiles: null,
        handling: null,
        informationSource: null,
      },
      ttps: null,
    },
  ];
  iocstx2json: any = [
    {
      type: 'indicator',

      spec_version: '2.1',

      id: 'indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',

      created_by_ref: 'identity--f431f809-377b-45e0-aa1c-6a4751cae5ff',

      created: '2016-04-06T20:03:48.000Z',

      modified: '2016-04-06T20:03:48.000Z',

      indicator_types: ['malicious-activity'],

      name: 'Poison Ivy Malware',

      description: 'This file is part of Poison Ivy',

      pattern: "[ file:hashes.'SHA-256' = '4bac27393bdd9777ce02453256c5577cd02275510b2227f473d03f533924f877' ]",

      valid_from: '2016-01-01T00:00:00Z',
    },
  ];
  iocstx21json: any = [
    {
      type: 'indicator',

      spec_version: '2.1',

      id: 'indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',

      created_by_ref: 'identity--f431f809-377b-45e0-aa1c-6a4751cae5ff',

      created: '2016-04-06T20:03:48.000Z',

      modified: '2016-04-06T20:03:48.000Z',

      indicator_types: ['malicious-activity'],

      name: 'Poison Ivy Malware',

      description: 'This file is part of Poison Ivy',

      pattern: "[ file:hashes.'SHA-256' = '4bac27393bdd9777ce02453256c5577cd02275510b2227f473d03f533924f877' ]",

      valid_from: '2016-01-01T00:00:00Z',
    },

    {
      type: 'relationship',

      spec_version: '2.1',

      id: 'relationship--44298a74-ba52-4f0c-87a3-1824e67d7fad',

      created_by_ref: 'identity--f431f809-377b-45e0-aa1c-6a4751cae5ff',

      created: '2016-04-06T20:06:37.000Z',

      modified: '2016-04-06T20:06:37.000Z',

      relationship_type: 'indicates',

      source_ref: 'indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',

      target_ref: 'malware--31b940d4-6f7f-459a-80ea-9c1f17b5891b',
    },

    {
      type: 'malware',

      spec_version: '2.1',

      id: 'malware--31b940d4-6f7f-459a-80ea-9c1f17b5891b',

      created: '2016-04-06T20:07:09.000Z',

      modified: '2016-04-06T20:07:09.000Z',

      created_by_ref: 'identity--f431f809-377b-45e0-aa1c-6a4751cae5ff',

      name: 'Poison Ivy',

      malware_types: ['trojan'],
    },
  ];
  threatactorstx1json: any = [
    {
      id: 'Patchwork',
      idref: null,
      timestamp: null,
      title: 'Patchwork',
      descriptions: [
        {
          value: null,
          id: null,
          ordinality: null,
          structuringFormat: null,
        },
      ],
      shortDescriptions: [],
      identity: null,
      types: [],
      motivations: [
        {
          value: {
            value: 'Espionage',
            vocabName: null,
            vocabReference: null,
          },
          descriptions: [],
          source: null,
          confidence: null,
          timestamp: null,
          timestampPrecision: 'SECOND',
        },
      ],
      sophistications: [],
      intendedEffects: [],
      planningAndOperationalSupports: [],
      observedTTPs: null,
      associatedCampaigns: null,
      associatedActors: null,
      handling: null,
      confidence: null,
      informationSource: null,
      relatedPackages: null,
      version: '1.2',
    },
  ];
  threatactorstx2json: any = [
    {
      aliases: ['Tsar Team'],
      primary_motivation: 'Financial, Reputation damage,BRONZE BUTLER,Charming Kitten,Charming Kitten',
      type: 'threat-actor',
      spec_version: '2.1',
      id: 'threat-actor--5bfb529faeee579885ab4b0a',
      modified: 'Mon Aug 24 12:37:41 IST 2020',
      name: 'Fancy Bear',
      description: '',
    },
    {
      source_ref: 'malware--5c8a10e25e3cda2edc2fde3c',
      target_ref: 'threat-actor--5bfb529faeee579885ab4b0a',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--5c8a10e25e3cda2edc2fde3ccae5ff',
      created: 'Tue Aug 25 15:40:11 IST 2020',
      modified: 'Tue Aug 25 15:40:11 IST 2020',
    },
    {
      is_family: false,
      malware_types: ['malware'],
      type: 'malware',
      spec_version: '2.1',
      id: 'malware--5c8a10e25e3cda2edc2fde3c',
      modified: '',
      name: 'BRONZE BUTLER',
      description: 'Agent.btz',
    },
    {
      type: 'campaign',
      spec_version: '2.1',
      id: 'campaign--5f43a3f21ecb81555037b351',
      modified: '',
      description: '',
      name: 'vision2025',
    },
    {
      source_ref: 'campaign--5f43a3f21ecb81555037b351',
      target_ref: 'threat-actor--5bfb529faeee579885ab4b0a',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--5f43a3f21ecb81555037b351cae5ff',
      created: 'Tue Aug 25 15:40:11 IST 2020',
      modified: 'Tue Aug 25 15:40:11 IST 2020',
    },
    {
      type: 'vulnerability',
      spec_version: '2.1',
      id: 'vulnerability--5e7ba49d2e93563ffc50160c',
      created: 'Mon Nov 17 10:30:00 IST 2003',
      modified: 'Tue Mar 24 20:27:00 IST 2020',
      name: 'CVE-2003-0845',
      // tslint:disable-next-line:max-line-length
      description:
        'Unknown vulnerability in the HSQLDB component in JBoss 3.2.1 and 3.0.8 on Java 1.4.x platforms, when running in the default configuration, allows remote attackers to conduct unauthorized activities and possibly execute arbitrary code via certain SQL statements to (1) TCP port 1701 in JBoss 3.2.1, and (2) port 1476 in JBoss 3.0.8.',
      external_references: [
        {
          source_name: 'cve',
          external_id: 'CVE-2003-0845',
        },
      ],
    },
    {
      source_ref: 'threat-actor--5bfb529faeee579885ab4b0a',
      target_ref: 'vulnerability--5e7ba49d2e93563ffc50160c',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--5bfb529faeee579885ab4b0acae5ff',
      created: 'Tue Aug 25 15:40:11 IST 2020',
      modified: 'Tue Aug 25 15:40:11 IST 2020',
    },
  ];
  vulnerabilitystx1json: any = [
    {
      id: 'CVE-2019-3874',
      idref: null,
      timestamp: null,
      title: 'CVE-2019-3874',
      descriptions: [],
      shortDescriptions: [],
      vulnerabilities: [
        {
          title: 'CVE-2019-3874',
          descriptions: [
            {
              // tslint:disable-next-line:max-line-length
              value:
                'The SCTP socket buffer used by a userspace application is not accounted by the cgroups subsystem. An attacker can use this flaw to cause a denial of service attack. Kernel 3.10.x and 4.18.x branches are believed to be vulnerable.',
              id: null,
              ordinality: null,
              structuringFormat: null,
            },
          ],
          shortDescriptions: [],
          cveid: 'CVE-2019-3874',
          osvdbid: null,
          source: null,
          discoveredDateTime: null,
          publishedDateTime: {
            value: '2019-03-25T19:29:00.000+0000',
            precision: 'SECOND',
          },
          affectedSoftware: null,
          references: {
            references: [],
          },
          isKnown: null,
          isPubliclyAcknowledged: null,
          cvssscore: {
            overallScore: null,
            baseScore: '6.5',
            baseVector: null,
            temporalScore: null,
            temporalVector: null,
            environmentalScore: null,
            environmentalVector: null,
          },
        },
      ],
      weaknesses: [],
      configurations: [],
      potentialCOAs: null,
      informationSource: {
        descriptions: [],
        identity: null,
        roles: [],
        contributingSources: null,
        time: null,
        tools: null,
        references: {
          references: ['https://nvd.nist.gov/vuln/detail/CVE-2019-3874'],
        },
      },
      handling: null,
      relatedExploitTargets: null,
      relatedPackages: null,
      version: '1.2',
    },
  ];
  vulnerabilitystx2xjson: any = [
    {
      type: 'vulnerability',
      spec_version: '2.1',
      id: 'vulnerability--5cc7cf09d1a5742447322171',
      created: '2019-01-31T03:59:00.000Z',
      modified: '2021-03-30T17:46:00.000Z',
      name: 'CVE-2019-0190',
      description:
        'A bug exists in the way mod_ssl handled client renegotiations. A remote attacker could send a carefully crafted request that would cause mod_ssl to enter a loop leading to a denial of service. This bug can be only triggered with Apache HTTP Server version 2.4.37 when using OpenSSL version 1.1.1 or later, due to an interaction in changes to handling of renegotiation attempts.',
      external_references: [
        {
          source_name: 'cve',
          external_id: 'CVE-2019-0190',
        },
      ],
    },
  ];
  vulnerabilitystx2json: any = [
    {
      type: 'vulnerability',
      spec_version: '2.1',
      id: 'vulnerability--0c7b5b88-8ff7-4a4d-aa9d-feb398cd0061',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
      name: 'CVE-2003-0845',
      // tslint:disable-next-line:max-line-length
      description:
        'Unknown vulnerability in the HSQLDB component in JBoss 3.2.1 and 3.0.8 on Java 1.4.x platforms, when running in the default configuration, allows remote attackers to conduct unauthorized activities and possibly execute arbitrary code via certain SQL statements to (1) TCP port 1701 in JBoss 3.2.1, and (2) port 1476 in JBoss 3.0.8.',
      external_references: [
        {
          source_name: 'cve',
          external_id: 'CVE-2003-0845',
        },
      ],
    },
    {
      source_ref: 'threat-actor--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
      target_ref: 'vulnerability--0c7b5b88-8ff7-4a4d-aa9d-feb398cd0061',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--57b56a43-b8b0-4cba-9deb-34e3e1faed9e',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
    },
    {
      aliases: [
        'APT 28',
        'APT28',
        'Fancy Bear',
        'Group 74',
        'IRON TWILIGHT',
        'Pawn Storm',
        'SIG40',
        'Sednit',
        'Sofacy',
        'Sofacy Group',
        'Strontium',
        'Swallowtail',
        'Threat Group-4127',
        'Tsar Team',
      ],
      primary_motivation: 'Financial, Reputation damage,BRONZE BUTLER,Charming Kitten,Charming Kitten',
      type: 'threat-actor',
      spec_version: '2.1',
      id: 'threat-actor--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
      // 'modified': '',
      name: 'Fancy Bear',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
      // tslint:disable-next-line:max-line-length
      description:
        'Russian state-sponsored hacking group closely affiliated with Russian intelligence service,GOTHIC PANDA,Stone Panda,FIN7,MISSION2025,,electric powder,lazarus group,BRONZE BUTLER,Charming Kitten',
    },
    {
      type: 'campaign',
      spec_version: '2.1',
      id: 'campaign--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcb5',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
      // tslint:disable-next-line:max-line-length
      description:
        'The global reconnaissance campaign is suspected to be carried out by unknown Chinese hacker groups. The campaign primarily targets multinational companies in multiple industries and is believed to be active from quite some time.',
      name: 'vision2025',
    },
    {
      source_ref: 'campaign--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcb5',
      target_ref: 'threat-actor--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--57b56a43-b8b0-4cba-9deb-34e3e1faed9e',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
    },
    {
      type: 'campaign',
      spec_version: '2.1',
      id: 'campaign--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcd3',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
      // tslint:disable-next-line:max-line-length
      description:
        'The global reconnaissance campaign is suspected to be carried out by unknown Chinese hacker groups. The campaign primarily targets multinational companies in multiple industries and is believed to be active from quite some time.',
      name: 'mission2025',
    },
    {
      source_ref: 'campaign--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcd3',
      target_ref: 'threat-actor--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--57b56a43-b8b0-4cba-9deb-34e3e1faed9e',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
    },
    {
      is_family: false,
      malware_types: ['malware'],
      type: 'malware',
      spec_version: '2.1',
      id: 'malware--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcb3',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
      name: 'emotet',
      // tslint:disable-next-line:max-line-length
      description:
        'Emotet is a modular malware variant which is primarily used as a downloader for other malware variants such as [TrickBot](https://attack.mitre.org/software/S0266) and IcedID. Emotet first emerged in June 2014 and has been primarily used to target the banking sector.',
    },
    {
      source_ref: 'malware--84e4d88f-44ea-4bcd-bbf3-b2c1c320bcb3',
      target_ref: 'threat-actor--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f',
      relationship_type: 'targets',
      type: 'relationship',
      spec_version: '2.1',
      id: 'relationship--57b56a43-b8b0-4cba-9deb-34e3e1faed9e',
      created: '2020-09-07T18:55:19.818Z',
      modified: '2020-09-07T18:55:19.818Z',
    },
  ];
  Compromisedstx2json: any = [
    {
      type: 'user-account',
      spec_version: '2.1',
      id: 'user-account--603eb4b2cbddc44cafa3ce76',
      user_id: 'xxxxx@xxxx.com',
      display_name: 'xxxxx@xxxxx.com',
      custom_properties: {
        password: 'XXXXXXXXX',
      },
    },
  ];
  alertsjson: any = [
    {
      uid: '5f44b772ef4c2a4944605063',
      risk_score: '4',
      latest_date_detected: null,
      association_with_TA: [],
      impersonated_domain: 'aveiro.dnc.pt',
      hosted_ip_address: '91.198.47.86',
      created_date: '25-08-2020',
    },
    {
      uid: '5f44baf0ef4c2a4944605330',
      risk_score: '4',
      latest_date_detected: null,
      association_with_TA: [],
      impersonated_domain: 'aveiro.cnc.pt',
      hosted_ip_address: '94.126.169.143',
      created_date: '25-08-2020',
    },
  ];
  exploitlertsjson: any = [
    {
      uid: '5f0e9541bf30661680f05d2d',
      exploitDate: '2020-07-14',
      risk_score: 7,
      author: 'Mehmet Ince',
      exploitId: '48667',
      description: '48667 Trend Micro Web Security Virtual Appliance 6.5 SP2 Patch 4 Build 1901 - Remote Code Execution (Metasploit)',
      source: 'https://www.exploit-db.com/exploits/48667',
      title: 'webapps : Multiple : 48667 Trend Micro Web Security Virtual Appliance 6.5 SP2 Patch 4 Build 1901 - Re',
      platform: 'Multiple',
      cves: 'CVE-2021-26296',
    },
  ];
  attacksurfacealertsjson: any = [
    {
      uid: '5ff831f46a254623bc403981',
      first_seen: '11-Feb-2021',
      top_domain: 'acme.com',
      softwares: 'php 5.2.4, windows , http_server , jquery ',
      possible_vulnerabilities: [
        {
          cyfirmaScore: 8.8,
          cveNo: 'CVE-2018-10549',
          // tslint:disable-next-line:max-line-length
          description:
            " An issue was discovered in PHP before 5.6.36, 7.0.x before 7.0.30, 7.1.x before 7.1.17, and 7.2.x before 7.2.5. exif_read_data in ext/exif/exif.c has an out-of-bounds read for crafted JPEG data because exif_iif_add_value mishandles the case of a MakerNote that lacks a final '\\0' character..",
        },
        {
          cyfirmaScore: 3.6,
          cveNo: 'CVE-2014-5459',
          // tslint:disable-next-line:max-line-length
          description:
            ' The PEAR_REST class in REST.php in PEAR in PHP through 5.6.0 allows local users to write to arbitrary files via a symlink attack on a (1) rest.cachefile or (2) rest.cacheid file in /tmp/pear/cache/, related to the retrieveCacheFirst and useLocalCache functions..',
        },
        {
          cyfirmaScore: 7.5,
          cveNo: 'CVE-2008-5658',
          // tslint:disable-next-line:max-line-length
          description:
            ' Directory traversal vulnerability in the ZipArchive::extractTo function in PHP 5.2.6 and earlier allows context-dependent attackers to write arbitrary files via a ZIP file with a file whose name contains .. (dot dot) sequences..',
        },
        {
          cyfirmaScore: 4.7,
          cveNo: 'CVE-2018-10545',
          // tslint:disable-next-line:max-line-length
          description:
            " An issue was discovered in PHP before 5.6.35, 7.0.x before 7.0.29, 7.1.x before 7.1.16, and 7.2.x before 7.2.4. Dumpable FPM child processes allow bypassing opcache access controls because fpm_unix.c makes a PR_SET_DUMPABLE prctl call, allowing one user (in a multiuser environment) to obtain sensitive information from the process memory of a second user's PHP applications by running gcore on the PID of the PHP-FPM worker process..",
        },
        {
          cyfirmaScore: 6.1,
          cveNo: 'CVE-2018-10547',
          // tslint:disable-next-line:max-line-length
          description:
            ' An issue was discovered in ext/phar/phar_object.c in PHP before 5.6.36, 7.0.x before 7.0.30, 7.1.x before 7.1.17, and 7.2.x before 7.2.5. There is Reflected XSS on the PHAR 403 and 404 error pages via request data of a request for a .phar file. NOTE: this vulnerability exists because of an incomplete fix for CVE-2018-5712..',
        },
      ],
      risk_score: 9,
      web_server: null,
      ip: '157.131.143.13',
      sub_domain: 'acme.com',
      description: 'You have software running in this system that have vulnerability CVE-2008-5557',
      open_ports: [80, 587, 110, 143, 8080, 465, 21, 25, 443],
      web_server_version: null,
    },
  ];
  phishingjson: any = [
    {
      verification_time: null,
      phish_id: null,
      source: 'openphis',
      phish_detail_url: null,
      ssl: null,
      asn_name: 'Namecheap, Inc.',
      cves: null,
      uid: '611b62943d729390125b078b',
      threat_actors: null,
      urls: null,
      file: null,
      country_name: 'United States',
      host: 'antonioprietopoza.com',
      details: [
        {
          ipAddress: '162.0.213.227',
          cidrBlock: null,
          announcingNetwork: null,
          rir: null,
          country: 'United States',
          detailTime: null,
        },
      ],
      brand: 'Generic/Spear Phishing',
      sector: null,
      created_time: 1629210599487,
      family_id: 'cda6f0f234f632e36a395f50daad35a1',
      risk_score: '7',
      iso_time: 1629181418000,
      iocs: null,
      ips: ['162.0.213.227'],
      sha: null,
      url: 'https://antonioprietopoza.com/wp-admin/new/?i=i&0=ugurlu1@akbank.com.tr',
      target: null,
      geographies: ['united states'],
      technologies: ['website hosting services', 'namecheap'],
      country_code: 'US',
      submission_time: 1629181418000,
      domain: ['com'],
      industries: ['software'],
      url_domain: 'antonioprietopoza.com',
      online: null,
      asn: 'AS22612',
      md5: null,
    },
  ];
  certificatejson: any = [
    {
      uid: '30bc6ad3331710486cacb1a1',
      first_seen: '2021-06-08T18:48:55.971Z',
      top_domain: 'acmebank.org',
      status: 'Weak',
      issued_by: 'C=US, O=Amazon, OU=Server CA 1B, CN=Amazon',
      issued_to: 'www.acmebank.org',
      issuer_public_hash: '252333a8e3abb72393d6499abbacca8604faefa84681ccc3e5531d44cc896450',
      valid_from: '2021-07-16T00:00:00.000+0000',
      valid_to: '2022-08-14T00:00:00.000+0000',
      cert_hash: 'e647d9cd250084bd49d3c088d8c312caa0f2f1a554d38c22a6e2cccb6a309384',
      cert_data:
        'MIIEczCCA1ugAwIBAgIQCJxdVhsqD2M+H2Zk4RBQoDANBgkqhkiG9w0BAQsFADBGMQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRUwEwYDVQQLEwxTZXJ2ZXIgQ0EgMUIxDzANBgNVBAMTBkFtYXpvbjAeFw0yMTA3MTYwMDAwMDBaFw0yMjA4MTQyMzU5NTlaMBcxFTATBgNVBAMTDGFjbWViYW5rLm9yZzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALERySr2inFSiH6hGPbhfEmKoYLk3fYUH/iTSZqAUboP65L3y6/99Rid10nmAENTgJc2m6HtROsXkH9WO1bYhfTClfKkRq5jIEf/XRjGJEWSwOUrsGuV4hUh2pwz6XJY8z27BWugXxxy5IKHPA5XoRXyrJ+VaSfZ3127uJZuzdelExA4mu6UYOXAz8Xake6CSLef8wQi2DLPVjA9xUbcK9SR+nlXT8ELTWaqTxZ3sqvy2mX6RCidPlKPC5qdV0TWrGAOGmH0Osa9hwuiLjZEta/6WGfGRu6Ua1GkD9QcbXnctV4cAH3JOzCsb1oHvy1ivzM2pol3SVlp6ajEI2795ZMCAwEAAaOCAYowggGGMB8GA1UdIwQYMBaAFFmkZgZSoHuVkjyjlAcnlnRb+T3QMB0GA1UdDgQWBBRP1QIBHHndAZnGJILB8u7EPTIhBTApBgNVHREEIjAgggxhY21lYmFuay5vcmeCEHd3dy5hY21lYmFuay5vcmcwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnNjYTFiLmFtYXpvbnRydXN0LmNvbS9zY2ExYi5jcmwwEwYDVR0gBAwwCjAIBgZngQwBAgEwdQYIKwYBBQUHAQEEaTBnMC0GCCsGAQUFBzABhiFodHRwOi8vb2NzcC5zY2ExYi5hbWF6b250cnVzdC5jb20wNgYIKwYBBQUHMAKGKmh0dHA6Ly9jcnQuc2NhMWIuYW1hem9udHJ1c3QuY29tL3NjYTFiLmNydDAMBgNVHRMBAf8EAjAAMBMGCisGAQQB1nkCBAMBAf8EAgUAMA0GCSqGSIb3DQEBCwUAA4IBAQBPBP1D2W5x1NSGzzh0oCT/eyxsL4qUY8yQGC9LL4tOd/g6VICTyH/2iatgjcHDsvNrXecuCf3RGLlUe7k8APgr/oaev7GBuQ4WNF3rgVyxDTMFZrNWN2jFlkp6S0K1pViM+aY8J1Uy3QtJdZtXC+IcGxnFFCLJvU5irRMuPZvL7gBQLiSqZ2WS/HeuAu4zNh3izxSio3XYZLSX3XelgiAgPJ8moox2h02DRLLUUBEuoi482UxAzo7FrG4Pr7G9KAAb4JD1cwdknrgFCGT56SiXyEvnCrYLA2hXxc6PdJcVGUBDieOgI2tMeHKhMGiNbKiS7scK78UkyczYTYtuuMDa',
      cert_type: 'precert',
      serial: '2726571199',
      version: null,
      risk_rating: 9,
      description: 'Insecure protocolsTLSv1, TLSv1.1 allowed',
      protocols: ['TLSv1', 'TLSv1.1'],
      self_signed: false,
      attacks: ['poodle'],
    },
  ];
  ipWithVulnerability: any = [
    {
      id: '12bc6ad3331710486cac3a11',
      ip: 'xxx.xxx.xxx.xx',
      impact: 'Open ports could be vulnerable to remotely exploitable vulnerability',
      recommendations: 'Make sure that all the latest patches are applied',
      cves: ['CVE-2018-6789', 'CVE-2014-2957', 'CVE-2011-4327', 'CVE-2008-3259', 'CVE-2014-2972'],
      risk_score: 9,
      associated_domains: ['taladrod.com'],
      ip_history: ['xxx.xxx.xxx.xx', 'xxx.xxx.xxx.xx'],
      sub_domains: ['reverse-27-254-171-101.csloxinfo.com', 'outgoing-5813724969.csloxinfo.com'],
      tags: ['database', 'self-signed', 'starttls'],
      ports: [993, 3306, 587, 110, 143, 80],
      hostnames: ['27-254-62-133.csloxinfo.com'],
    },
  ];
  brandInfrigementjson: any = [
    {
      uid: '5e207fe3b022ff53d5dfa2eb',
      title: 'Similar twitter account acme1 found',
      category: 'Brand Infringement',
      asset_type: 'Twitter',
      source: 'http://twitter.com/acme1',
      posted_date: '2012-02-21',
      description: 'Name: fran firma antoni , Id: acme1 , Source: http://twitter.com/acme1',
      impact: 'Potential for brand damage or for customers to be misled',
      recommendations:
        'If the channel is required to be removed from the site, a report can be submitted via the report link on their profile.',
      created_at: '2021-08-15',
      asset_category: 'twitter',
      asset_name: 'acme',
      source_type: 'twitter',
      riskScore: 4,
    },
  ];
  dataleakjson: any = [
    {
      uid: '60f8307642869246e914b5f9',
      title:
        'Leaked data found for domain acmebank.com - NewFEEDS-NOV2020.rar/whois/whois_08-06-20.rar/whois_08-06-20.csv [Part 8 of 11]-2021-04-01',
      category: 'Data Leak',
      asset_type: 'Domain',
      asset_name: 'acmebank.com',
      created_at: '2021-07-21',
      source: null,
      posted_date: '2021-04-01',
      description: 'Leaked data found for domain acmebank.com',
      impact: 'Identifiable client systems information exposed online.',
      recommendations: 'This page is not available anymore, we will keep monitoring.',
      breached_data: 'acmebank.com,&quot;GODADDY.COM',
      risk_score: 6,
    },
  ];
  vulnerabilityjson: any = [
    {
      uid: '6052c2baec049e6e5c30f970',
      cveNo: 'CVE-2021-25382',
      type: null,
      vulnerabilityType: null,
      newsCategory: 'Vulnerabilities and Exploits',
      recommendation: null,
      priority: 5,
      cyfirmaScore: 6,
      isReserved: false,
      isCyberNews: true,
      publishedDate: '2021-04-23T15:15Z',
      lastModifiedDate: '2021-05-03T14:51Z',
      cve: {
        problemtype: {
          problemtype_data: [
            {
              description: [
                {
                  lang: 'en',
                  value: 'CWE-863',
                },
              ],
            },
          ],
        },
        references: {
          reference_data: [
            {
              url: 'https://security.samsungmobile.com/securityUpdate.smsb?year=2020&month=10',
              name: 'https://security.samsungmobile.com/securityUpdate.smsb?year=2020&month=10',
              refsource: 'CONFIRM',
              tags: ['Vendor Advisory'],
            },
          ],
        },
        description: {
          description_data: [
            {
              lang: 'en',
              value:
                'An improper authorization of using debugging command in Secure Folder prior to SMR Oct-2020 Release 1 allows unauthorized access to contents in Secure Folder via debugging command.',
            },
          ],
        },
        affects: null,
        cvedataMeta: {
          ID: 'CVE-2021-25382',
          ASSIGNER: 'mobile.security@samsung.com',
        },
        data_type: 'CVE',
        data_format: 'MITRE',
        data_version: '4.0',
        CVE_data_meta: {
          ID: 'CVE-2021-25382',
          ASSIGNER: 'mobile.security@samsung.com',
        },
      },
      impact: {
        baseMetricV3: {
          cvssV3: {
            version: '3.1',
            vectorString: 'CVSS:3.1/AV:P/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:N',
            attackVector: 'PHYSICAL',
            attackComplexity: 'LOW',
            privilegesRequired: 'HIGH',
            userInteraction: 'NONE',
            scope: 'UNCHANGED',
            confidentialityImpact: 'HIGH',
            integrityImpact: 'HIGH',
            availabilityImpact: 'NONE',
            baseScore: 5.5,
            baseSeverity: 'MEDIUM',
          },
          exploitabilityScore: 0.3,
          impactScore: 5.2,
        },
        baseMetricV2: {
          cvssV2: {
            version: '2.0',
            vectorString: 'AV:L/AC:L/Au:N/C:P/I:P/A:N',
            accessVector: 'LOCAL',
            accessComplexity: 'LOW',
            authentication: 'NONE',
            confidentialityImpact: 'PARTIAL',
            integrityImpact: 'PARTIAL',
            availabilityImpact: 'NONE',
            baseScore: 3.6,
          },
          severity: 'LOW',
          exploitabilityScore: 3.9,
          impactScore: 4.9,
          obtainAllPrivilege: false,
          obtainUserPrivilege: false,
          obtainOtherPrivilege: false,
          userInteractionRequired: false,
          acInsufInfo: false,
        },
      },
      configurations: {
        CVE_data_version: '4.0',
        nodes: [
          {
            operator: 'OR',
            children: [],
            cpe_match: [
              {
                vulnerable: true,
                cpe23Uri: 'cpe:2.3:o:google:android:8.0:*:*:*:*:*:*:*',
                'cpe.name': [],
              },
              {
                vulnerable: true,
                cpe23Uri: 'cpe:2.3:o:google:android:8.1:*:*:*:*:*:*:*',
                'cpe.name': [],
              },
              {
                vulnerable: true,
                cpe23Uri: 'cpe:2.3:o:google:android:9.0:*:*:*:*:*:*:*',
                'cpe.name': [],
              },
              {
                vulnerable: true,
                cpe23Uri: 'cpe:2.3:o:google:android:10.0:*:*:*:*:*:*:*',
                'cpe.name': [],
              },
              {
                vulnerable: true,
                cpe23Uri: 'cpe:2.3:o:google:android:11.0:*:*:*:*:*:*:*',
                'cpe.name': [],
              },
            ],
          },
        ],
      },
      cveDetails: null,
      vendorStatement: null,
      threatActors: ['putter panda', 'scarlet mimic', 'fancy bear'],
      campaigns: ['Enlightenment'],
      targetCountries: [],
      technologies: ['operating system', 'google'],
      vendors: ['google'],
      products: ['android'],
      productVersions: {
        android: ['8.0', '8.1', '9.0', '10.0', '11.0'],
      },

      reserved: false,
      description:
        ' An improper authorization of using debugging command in Secure Folder prior to SMR Oct-2020 Release 1 allows unauthorized access to contents in Secure Folder via debugging command..',
      thirdPartyAdvisory: [],
      vendorAdvisory: ['https://security.samsungmobile.com/securityUpdate.smsb?year=2020&month=10'],
      cyberNews: true,
    },
  ];
  riskdossierIOcjson: any = {
    title: 'This view summarizes the risk dossier for the selected indicator for your organisation.',
    riskViewScores: {
      riskScore: 8,
      externalThreatScore: 8,
      riskScoreTrend: 'EQUAL',
      externalThreatScoreTrend: 'EQUAL',
    },
    riskDossierDetails: [
      {
        story:
          'This IP address <span class="active-txt cp IP">158.255.7.61</span> is malicious in nature. Additional Information for the IP address.',
        description: null,
        impact: null,
        riskScore: 8,
        type: 'IP ADDRESS',
        relation: null,
        action: 'Block the IP address.',
        link: null,
        details: {
          'ASN Owner': 'Hostkey B.v.',
          ASN: '50867',
          Organization: 'Hostkey B.v.',
          'Country Name': 'Russia',
        },
        relExploit: {},
        iocAttribute: {
          md5: [],
          sha: [],
          ips: [],
          domain: [],
          hostname: [],
          url: [],
          file: [],
          ssl: [],
          mutex: [],
          emails: [],
          cves: [],
          exploits: [],
          coRelation: {},
        },
      },
      {
        story:
          '<span class="active-txt cp Campaign">bn34unit</span> campaign associated with IP Address <span class="active-txt cp IP">158.255.7.61</span>.',
        description:
          'The campaign is believed to have been launched on 26 March 2021, targeting global web servers, email, content management servers and their operating servers, which has any financial value.\nMotivation: Stealing of sensitive information/content, personal, customer and financial information\n',
        impact: null,
        riskScore: 10,
        type: 'CAMPAIGN',
        relation: null,
        action: 'Please refer to our campaign details page to find the recommendations.',
        link: null,
        details: {
          'Threat Actor': '<span class="active-txt cp TA">Emissary Panda</span>',
          industry: 'Trading Companies & Distributors,Internet & Direct Marketing Retail,IT Services',
        },
        relExploit: {},
        iocAttribute: {
          md5: [],
          sha: [],
          ips: [],
          domain: [],
          hostname: [],
          url: [],
          file: [],
          ssl: [],
          mutex: [],
          emails: [],
          cves: [],
          exploits: [],
          coRelation: {},
        },
      },
      {
        story: 'These are the latest IOCs related to <span class="active-txt cp IP">158.255.7.61</span>.',
        description: null,
        impact: null,
        riskScore: null,
        type: 'IOC',
        relation: null,
        action: 'Block these IOCs.',
        link: null,
        details: {},
        relExploit: {},
        iocAttribute: {
          md5: [],
          sha: [
            {
              id: null,
              key: 'SHA',
              value: '4ae4df2bdb0428cace1085e4cc200ef1133affded57ee41fdc75fe5c9a9421ef',
              firstSeen: null,
              lastSeen: null,
              threatActorName: null,
              threatActorID: null,
              role: null,
              category: null,
              recommended: null,
              threatScore: null,
              countryCode: null,
              countryName: null,
              tags: [],
            },
            {
              id: null,
              key: 'SHA',
              value: '67d8f6ed6fe28fc2f62550dcdac4807b39531ac2750706e4d36c8113c3f267ed',
              firstSeen: null,
              lastSeen: null,
              threatActorName: null,
              threatActorID: null,
              role: null,
              category: null,
              recommended: null,
              threatScore: null,
              countryCode: null,
              countryName: null,
              tags: [],
            },
            {
              id: null,
              key: 'SHA',
              value: '9ff7e6f3213641b42fd020fc4699eccb0d932f768ea725f8818c9dd54b37bc61',
              firstSeen: null,
              lastSeen: null,
              threatActorName: null,
              threatActorID: null,
              role: null,
              category: null,
              recommended: null,
              threatScore: null,
              countryCode: null,
              countryName: null,
              tags: [],
            },
            {
              id: null,
              key: 'SHA',
              value: '9064a3d677d98867ca776d28f12638dff1c7ce0ccf55ba2cf18a56e2d67fc497',
              firstSeen: null,
              lastSeen: null,
              threatActorName: null,
              threatActorID: null,
              role: null,
              category: null,
              recommended: null,
              threatScore: null,
              countryCode: null,
              countryName: null,
              tags: [],
            },
            {
              id: null,
              key: 'SHA',
              value: 'a853a78786c98acae16dc41a8fe82f3733be322bb640180f025a14973c06ad75',
              firstSeen: null,
              lastSeen: null,
              threatActorName: null,
              threatActorID: null,
              role: null,
              category: null,
              recommended: null,
              threatScore: null,
              countryCode: null,
              countryName: null,
              tags: [],
            },
          ],
          ips: [],
          domain: [],
          hostname: [],
          url: [],
          file: [],
          ssl: [],
          mutex: [],
          emails: [],
          cves: [],
          exploits: [],
          coRelation: {},
        },
      },
    ],
  };
  impdatadiscoverjson: any = [
    {
      uid: '60094ad2b7e02966f85f9264',
      malicious_Dns: [],
      risk_score: '9',
      hosted_ip_address: '0.0.0.0',
      threat_actor: ['Fancy Bear'],

      association_with_TA: ['Fancy Bear'],
    },
  ];
  attacksurfacedatadiscoverjson: any = [
    {
      uid: '6199937e4286926de9c02d7c',
      first_seen: '21-Nov-2021',
      top_domain: '',
      softwares: '',
      possible_vulnerabilities: [],
      risk_score: '1',
      web_server: null,
      ip: '0.0.0.0',
      description: null,
      open_ports: [],
      web_server_version: null,
    },
    {
      uid: '6199937e4286926de9c02d79',
      first_seen: '21-Nov-2021',
      top_domain: '',
      softwares: 'http_server ',
      possible_vulnerabilities: [],
      risk_score: '1',
      web_server: null,
      ip: '0.0.0.0.0',
      description: null,
      open_ports: [],
      web_server_version: null,
    },
  ];
  certificatedatadiscoverjson: any = [
    {
      issued_by: 'C=US, O=Digi, OU=www.di, CN=2018',
      cert_type: 'cert',
      first_seen: '21-Nov-2021',
      issued_to: '',
      risk_score: 1,
      description: '',
      valid_from: '2021-03-31',
      cert_data:
        'MIIF9TCCBN2gAwINlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNlcnQuY29tMRDAeFw0yMTAzMzEwMDAAJBgNVBAYTAkpQMQ4wDAYDVQQIEwVUb2t5bzETMBEGA1UEBxMKQ0hJWU9EQS1LVTEdMBsGA1UEChMUSkFQQU4gUE9TVCBDby4sIEx0ZC4xFDASBgNVBAMMCyoueXUtYmluLmpwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwKXJpk5yRZ9W+DtPHVd6kRdX54gQgBJAy06hLRD/LPa9vsMchUAPg518hHkeHIrG3aT4fRnECQV5YL84M3YjkQkHtxTRZcaSgFqYqSiSFrw52B7uy7NZxzaA5CM47khi29tznlnmL4Yx14A38OQ+CYdIttQkQ3nmrlBLG9NWwu04WJ6KyIrasLAcek+cwvFk73uIM0ldwbvJgSLIsSN5QC3lm4aa52Pb8o3LtJTBMDU2RwIx7nkrr/PNbh7ZMuZYgldyA0/unW/KbojW6Kv2dREukUFK31Mg75BM3r1ARs1IO5fdBPHHNwN6mA0B1epymyrh/vbnJL35UPsLLDZvZQIDAQABo4ICpDCCAqAwHwYDVR0jBBgwFoAUkFj/sJx1qFFUd7Ht8qNDFjiebMUwHQYDVR0OBBYEFGS12gNEOyRmw3NejHc4lP7Ftj99MCEGA1UdEQQaMBiCCyoueXUtYmluLmpwggl5dS1iaW4uanAwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjA+BgNVHR8ENzA1MDOgMaAvhi1odHRwOi8vY2RwLmdlb3RydXN0LmNvbS9HZW9UcnVzdFJTQUNBMjAxOC5jcmwwPgYDVR0gBDcwNTAzBgZngQwBAgIwKTAnBggrBgEFBQcCARYbaHR0cDovL3d3dy5kaWdpY2VydC5jb20vQ1BTMHUGCCsGAQUFBwEBBGkwZzAmBggrBgEFBQcwAYYaaHR0cDovL3N0YXR1cy5nZW90cnVzdC5jb20wPQYIKwYBBQUHMAKGMWh0dHA6Ly9jYWNlcnRzLmdlb3RydXN0LmNvbS9HZW9UcnVzdFJTQUNBMjAxOC5jcnQwDAYDVR0TAQH/BAIwADCCAQUGCisGAQQB1nkCBAIEgfYEgfMA8QB2AEalVet1+pEgMLWiiWn0830RLEF0vv1JuIWr8vxw/m1HAAABeIcNui8AAAQDAEcwRQIhAPmobcwn64j8sCgPoArDI9YI3+FnBEbmeue97TUMHp2VAiBQPCefVf0zEdgLNWhayYJ5gsr2FHQ9RJsVXhA6Rl+P1QB3ACJFRQdZVSRWlj+hL/H3bYbgIyZjrcBLf13Gg1xu4g8CAAABeIcNukgAAAQDAEgwRgIhANSsWWm/EbN6g/oSJiLB8iFuClN+0g2AxO7IiSHn6/KhAiEAr/SZAXh2rPLobdnya+XshSTIJlHViWYPUVnhbf/az/QwDQYJKoZIhvcNAQELBQADggEBAK4rkqjRKxOxJ+FsRvEBBqLag3ZG95EhZbcHWlIvol1yEF92fmPm2mOq70Qk8HlG+I0pfAybOgANVhvpySoHxpe7pXbTLMArC3pnwk7GXrD3HoLBCqxnr86jdyCoPoSK3XTpaT9DUY2fiODVuY8jLmOzATGbqxbCfsFd0xcTwhTUaH7GIifAP3TWyE54GJdijtwce5U67cNvQ3wzEzf1RyYE1EdRRgjC8lGYGJKH3XPs6OrqhLwJhaweMIgjyItQTJHxM5EWXl5XlpRLQ4LcC3JOcUr7k4tKSC/x1qht6ruHYiW4oGNnoGG/l2SSkQoXk2ieKxAjnuD6vXJqx/0KKSU=',
      issuer_public_hash: 'cd4278ac811b0a97c24504fa37a0',
      version: null,
      uid: '619996130b2c57f',
      top_domain: '',
      serial: '241633',
      attacks: [],
      valid_to: '2022-05-01',
      cert_hash: '10871d2d3c8ffe0b51a70e2195e4e',
      protocols: [],
      self_signed: false,
      status: 'Active',
    },
  ];
  dataleakdatadiscoverjson: any = [
    {
      uid: '5e737bcb',
      asset_name: '',
      risk_score: '5',
      impact: 'Identifiable client systems information exposed online.',
      asset_type: 'Domain',
      description: 'Leaked data found for domainp',
      source: '',
      title: 'Leaked data found for domain',
      category: 'Data Leak',
      recommendations: 'Please contact the site in case you need to take down this post.',
      breached_data: 'null',
    },
  ];
  brandInfrigementdatadiscoverjson: any = [
    {
      uid: '5e7c6398bba162',
      asset_category: 'twitter',
      asset_name: 'null',
      risk_score: '4',
      impact: 'Potential for brand damage or for customers to be misled',
      asset_type: 'Twitter',
      description: 'Name: null',
      source_type: ['twitter'],
      source: 'http://twitter.com/null',
      title: 'Similar twitter account null found',
      category: 'Brand Infringement',
      recommendations:
        'If the channel is required to be removed from the site, a report can be submitted via the report link on their profile.',
    },
  ];
  ipWithVulnerabilitydatadiscoverjson: any = [
    {
      uid: '5e78b0aa428692398d889911',
      ip_history: [],
      sub_domains: [],
      risk_score: '1',
      ip: '',
      impact: 'Open ports could be vulnerable to remotely exploitable vulnerability',
      hostnames: [],
      associated_domains: {},
      ports: [],
      recommendations: 'Make sure that all the latest patches are applied',
      cves: [],
      tags: [],
    },
  ];
  vulnerabilitydatadiscoverjson: any = [
    {
      third_party_advisory: [],
      configurations: {
        CVE_data_version: '4.0',
        nodes: [],
      },
      lastModified_date: 1563279600000,
      recommendation: null,
      description: ' ',
      target_countries: [],
      cvedataMeta: null,
      type: '',
      products: ['server', 'ace', 'workstation', 'ubuntu_linux', 'esx', 'player'],
      uid: '5d307f1442869244feec948a',
      threat_actors: [],
      cve_no: 'CVE-2007',
      cve: {
        problemtype: {
          problemtype_data: [
            {
              description: [
                {
                  lang: 'en',
                  value: '',
                },
              ],
            },
          ],
        },
        references: {
          reference_data: [],
        },
        description: {
          description_data: [
            {
              lang: 'en',
              value: '',
            },
          ],
        },
        affects: null,
        cvedataMeta: {
          ASSIGNER: '',
          ID: 'CVE-2007',
        },
        data_type: 'CVE',
        data_format: 'MITRE',
        data_version: '4.0',
        CVE_data_meta: {
          ASSIGNER: 'cve',
          ID: 'CVE-2007',
        },
      },
      campaigns: [],
      vendorStatement: null,
      vendors: ['vmware', 'canonical'],
      vulnerability_type: 'Code Execution',
      vendor_advisory: [],
      risk_score: '10',
      impact: {
        baseMetricV2: {
          cvssV2: {
            version: '2.0',
            vectorString: '',
            accessVector: '',
            accessComplexity: 'LOW',
            authentication: 'NONE',
            confidentialityImpact: 'COMPLETE',
            integrityImpact: 'COMPLETE',
            availabilityImpact: 'COMPLETE',
            baseScore: 10.0,
          },
          severity: 'HIGH',
          exploitabilityScore: 10.0,
          impactScore: 10.0,
          obtainAllPrivilege: true,
          obtainUserPrivilege: false,
          obtainOtherPrivilege: false,
          userInteractionRequired: false,
        },
      },
      priority: 5,
      technologies: [
        'vmware workstation',
        'server',
        'ace',
        'vmware',
        'workstation',
        'ubuntu_linux',
        'canonical',
        'esx',
        'player',
        'Application',
        'Operating System',
        'lts',
        'Vmware',
        'Vmware workstation',
      ],
      product_versions: {
        ace: [],
        player: [],
        server: [],
        'sw.edition': ['lts'],
        type: ['Operating System'],
        workstation: [],
      },
      published_date: 1190402220000,
    },
  ];
  exploitdatadiscoverjson: any = [
    {
      uid: '5f0e9541bf30661680f05d2d',
      exploitDate: '2020-07-14',
      risk_score: 7,
      author: '',
      exploitId: '48667',
      description: '',
      source: 'https://www.exploit-db.com/exploits/',
      title: 'webapps',
      platform: 'Multiple',
      cves: 'CVE-2021',
    },
  ];
  phishingdatadiscoverjson: any = [
    {
      verification_time: null,
      phish_id: null,
      phish_detail_url: null,
      source: 'openphis',
      ssl: null,
      asn_name: 'Inc.',
      cves: null,
      uid: '618b81d7e3e7',
      threat_actors: null,
      urls: null,
      file: null,
      country_name: 'United States',
      host: '',
      details: [
        {
          ipAddress: '0.0.0.0',
          cidrBlock: null,
          announcingNetwork: null,
          rir: null,
          country: 'United States',
          detailTime: null,
        },
      ],
      brand: '.',
      sector: 'e-Commerce',
      family_id: 'd8948c3fd2b',
      risk_score: '7',
      iso_time: '2021-11-09',
      iocs: null,
      ips: ['0.0.0.0'],
      sha: null,
      url: '',
      target: null,
      geographies: ['united states'],
      technologies: ['application delivery controllers', 'cloudflare'],
      country_code: 'US',
      domain: ['com'],
      industries: ['software', 'e-commerce'],
      submission_time: '2021-11-09',
      url_domain: '.com',
      online: null,
      asn: 'AS13335',
      md5: null,
    },
  ];
  malwaredatadiscoverjson: any = [
    {
      id: null,
      title: '3PARA RAT',
      type: 'MALWARE',
      category: 'MALWARE',
      date: null,
      source: 'malware',
      sourceType: null,
      riskScore: 7,
      impact: null,
      threatActors: ['Putter Panda'],
      campaigns: [],
      geographies: [],
      technologies: [],
      industries: [],
      count: 0,
      firstSeen: null,
      lastSeen: 1638184034182,
      relatedKeywords: {
        campaigns: [],
        geography: [],
        industry: [],
        technology: [],
        threatActors: ['Putter Panda'],
      },
      isNew: false,
      isIndustry: false,
      isGeography: false,
      isTechnology: false,
      isThreatActor: true,
      isCampaign: false,
    },
    {
      id: null,
      title: 'WaterBear Malware',
      type: 'MALWARE',
      category: 'MALWARE',
      date: null,
      source: 'malware',
      sourceType: null,
      riskScore: 5,
      impact: null,
      threatActors: ['BlackTech'],
      campaigns: [],
      geographies: ['Japan'],
      technologies: ['Windows Os'],
      industries: ['Government Entities', 'Technology Companies'],
      count: 0,
      firstSeen: 1575743400000,
      lastSeen: 1638180917475,
      relatedKeywords: {
        campaigns: [],
        geography: [],
        industry: [],
        technology: [],
        threatActors: ['Blacktech'],
      },
      isNew: false,
      isIndustry: false,
      isGeography: false,
      isTechnology: false,
      isThreatActor: true,
      isCampaign: false,
    },
  ];
  campaigndatadiscoverjson: any = [
    {
      id: null,
      title: 'Enlightenment',
      status: null,
      date: 1624492800000,
      type: 'CAMPAIGN',
      source: null,
      sourceType: null,
      riskScore: 10,
      alias: ['просветление'],
      threatActor: ['TURLA GROUP', 'FANCY BEAR'],
      geographies: [],
      technologies: ['Smtp', 'Windows', 'Android', 'RDP'],
      industries: [
        'Large Energy',
        'Chemical',
        'Infrastructure',
        'Malware',
        'Software',
        'Manufacturing',
        'Vulnerabilities',
        'Power',
        'Android',
      ],
      firstSeen: 1546281000000,
      lastSeen: 1624492800000,
      relatedKeywords: {
        campaigns: ['Test', 'Enlightenment', 'Просветление'],
        geography: [],
        industry: ['Malware', 'Software', 'Vulnerabilities', 'Android'],
        technology: ['Windows'],
        threatActors: ['Fancy Bear', 'Multiple', 'Turla Group'],
      },
      isNew: false,
      isIndustry: true,
      isGeography: false,
      isTechnology: true,
      isThreatActor: true,
      isReported: true,
    },
  ];
  openportjson: any = [
    {
      uid: '',
      first_seen: '2022-07-07 09:01:18',
      top_domain: 'zz.com',
      software: 'windows ',
      risk_score: 1,
      web_server: '',
      ip: '',
      alert_created_date: '2022-07-27 04:44:44',
      sub_domain: 'www.big.zz.com',
      description: null,
      open_ports: [],
      web_server_version: null,
    },
  ];
  ipvulnerajson: any = [
    {
      first_seen: '2022-07-07 09:01:19',
      softwares: null,
      possible_vulnerabilities: [],
      risk_score: 1,
      web_server: null,
      ip: null,
      alert_created_date: '2022-07-26 05:08:16',
      description: null,
      web_server_version: null,
      uid: '62c6a0df3',
      top_domain: 'zzz.com',
      sub_domain: 'www.support.zz.com',
      open_ports: [],
    },
  ];
  cofigurationjson: any = [
    {
      uid: '',
      top_domain: '',
      sub_domain: '',
      domain_status: '',
      dns_sec: '',
      missing_epp_codes: ['', ''],
      cookie_xss_protection: false,
      secure_cookie: false,
      strict_transport_Security: false,
      click_jacking_defence: false,
      data_injection_defence: false,
      risk_score: 9,
      alert_created_date: '2022-07-27 04:44:44',
      dmarc: '',
      spf: '',
      open_relay: '',
      domain_expiry: '2022-07-27 04:44:44',
    },
  ];
  cloudWeaknessjson: any = [
    {
      uid: '',
      title: '',
      category: '',
      asset_type: '',
      asset_name: '',
      asset_category: '',
      source: 'getSource',
      source_type: ['', ''],
      description: '',
      impact: '',
      recommendations: '',

      alert_created_date: '',
      risk_score: 9,
    },
  ];
  ipreputionjson: any = [
    {
      country: 'India',
      reports: [],
      risk_score: 1,
      ip: '40.99.9.168',
      isp: 'Microsoft Corporation',
      alert_created_date: '2022-07-04 04:20:12',
      uid: '623e5c069e80492af5efb3fb',
      country_code: 'IN',
      top_domain: 'cyfirma.com',
      ip_version: 4,
      usage_type: 'Data Center/Web Hosting/Transit',
      sub_domain: 'autodiscover.cyfirma.com',
      categories: [],
    },
  ];
  certificatejson1: any = [
    {
      issued_by: '',
      cert_type: 'z',
      first_seen: '2022-05-21 10:19:10',
      issued_to: 'zz.com',
      risk_score: 1,
      alert_created_date: '2022-07-04 04:20:08',
      description: '',
      valid_from: '2022-04-11 12:00:00',
      cert_data: 'J3MYLvGXdavjl5yDKYLFJ96aeWq8uzgVJL1bORmkGX1Ooj9P8w=',
      issuer_public_hash: 'f11c38f74e6e33ff5173ed698f',
      version: 'V3',
      uid: '6288bc9e0',
      top_domain: 'zz.com',
      serial: '361280',
      attacks: [],
      valid_to: '2023-04-09 12:00:00',
      cert_hash: 'e8f36995758d556865',
      protocols: [],
      self_signed: false,
      status: 'Active',
    },
  ];
  impersonationinfrugmentjson: any = [
    {
      first_seen: '2021-05-05',
      last_seen: '',
      signature: 'zz.in',
      risk_score: 9,
      host_provider: null,
      impact: 'Potential for brand damage or for customers to be misled.',
      alert_created_date: '2022-07-27 08:08:42',
      description: '',
      ip_address: null,
      uid: 'qwq22222',
      category: 'Brand Infringement',
      registered_date: '2020-05-12',
      mail_server: null,
      suspected_threat_actor: [],
      asset_type: '',
    },
  ];
  phishingJson: any = [
    {
      uid: '',
      signature: '',
      category: '',
      comments: '',
      safe_flag_comments: '',
      description: '',
      impact: '',
      alert_created_date: '2022-07-04 04:20:08',
      registered_date: '2022-07-04 04:20:08',
      first_seen: '2022-07-04 04:20:08',
      last_seen: '2022-07-04 04:20:08',
      risk_score: 9,
    },
  ];
  ransomwareJson: any = [
    {
      uid: '',
      signature: '',
      category: '',
      comments: '',
      safe_flag_comments: '',
      description: '',
      impact: '',
      alert_created_date: '2022-07-04 04:20:08',
      registered_date: '2022-07-04 04:20:08',
      first_seen: '2022-07-04 04:20:08',
      last_seen: '2022-07-04 04:20:08',
      risk_score: 9,
    },
  ];
  darkwebJson: any = [
    {
      comments: null,
      first_seen: '2022-10-04',
      last_seen: '2022-10-04',
      signature: 'A Land',
      risk_score: 9,
      impact: 'Potential sensitive information exposed online.',
      alert_created_date: '2022-09-30T05:18:50.101',
      description: 'Over the last 24 hours',
      title: 'A Bank mentioned in Dark web - 2020-12-10',
      safe_flag_comments: null,
      uid: '63380d2',
      category: 'Company',
      posted_date: '2022-10-04',
    },
  ];
  sourceCodeJson: any = [
    {
      uid: '5e2151c2b7',
      first_seen: '2020-01-17',
      last_seen: '',
      signature: '',
      risk_score: 4,
      impact: 'Identifiable client systems information exposed online.',
      alert_created_date: '2022-07-27 08:08:47',
      recommendation: 'Please contact Github in case you need to take down this post.',
      description: '',
      source: '',
      category: 'Company',
      posted_date: '2020-12-08',
    },
  ];
  maliciousMobileAppsJson: any = [
    {
      uid: '5e2151c2b7',
      first_seen: '2020-01-17',
      last_seen: '',
      signature: '',
      risk_score: 4,
      impact: 'Identifiable client systems information exposed online.',
      alert_created_date: '2022-07-27 08:08:47',
      recommendation: 'Please contact Github in case you need to take down this post.',
      description: '',
      source: '',
      category: 'Company',
      posted_date: '2020-12-08',
    },
  ];
  confidentialFilesJson: any = [
    {
      uid: '5e2151c2b7',
      first_seen: '2020-01-17',
      last_seen: '',
      signature: '',
      risk_score: 4,
      impact: 'Identifiable client systems information exposed online.',
      alert_created_date: '2022-07-27 08:08:47',
      recommendation: 'Please contact Github in case you need to take down this post.',
      description: ' ',
      source: '',
      category: 'Company',
      posted_date: '2020-12-08',
    },
  ];
  pIICIIJson: any = [
    {
      uid: '5e2151c2b7',
      first_seen: '2020-01-17',
      last_seen: '',
      signature: '',
      risk_score: 4,
      impact: 'Identifiable client systems information exposed online.',
      alert_created_date: '2022-07-27 08:08:47',
      recommendation: 'Please contact Github in case you need to take down this post.',
      description: '',
      source: '',
      category: 'Company',
      posted_date: '2020-12-08',
      breached_data: '',
    },
  ];

  bcc: any;
  isBccValid = false;
  endMinDate: any;
  activePackage: any = {};
  packageColors: any = { platinum: '#E5E4E2', gold: '#FFD700', silver: '#C0C0C0', lite: '#C4AEAD', default: '#CCC' };
  refererType!: any;
  defaultRoute = true;
  tpdList: any[] = [];
  searchTPD = '';
  isVulnerabilityChecked = true;
  pov: any = '';
  assetName: any;
  action: any = '';
  monitors = [
    { value: 0, name: 'ASSETS' },
    { value: 1, name: 'DIGITAL RISK KEYWORDS' },
    { value: 2, name: 'THIRD PARTY DOMAIN' },
  ];
  filteredAnalyst!: Observable<any[]>;
  filteredSales!: Observable<any[]>;
  filteredPresales!: Observable<any[]>;
  selectedAnalystsList: any[] = [];
  sdSalesList: any[] = [];
  sdPresalesList: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dcs: DataCommunicationService,
    private orgDetailsService: OrgDetailsService,
    private orgAssetsService: OrgAssetsService,
    private orgAssetsTempService: OrgAssetsTempService,
    private orgUserService: OrgUserService,
    private roleService: RoleService,
    private orgAnalystService: OrgAnalystService,
    private orgReportFrequencyService: OrgReportFrequencyService,
    private orgReportRecipientService: OrgReportRecipientService,
    private orgService: OrgService,
    private orgSubscriptionService: OrgSubscriptionService,
    private OrgSubscriptionAuditService: OrgSubscriptionAuditService,
    public snackbar: MatSnackBar,
    private dateUtils: JhiDateUtils,
    private passwordResetInitService: PasswordResetInitService,
    private dataService: DataService,
    private userService: UserService,
    private ctds: CyberThreatDashboardService,
    private feedService: FeedService,
    private orgReportConfigService: OrgReportConfigService,
    private location: Location,
    private eventManager: JhiEventManager
  ) {
    this.dispConfig = this.dataService.getDispConfig();
    this.resetPageInfo();
    this.selectedKey = 'All';
    this.params = this.activatedRoute.snapshot.params;
    this.navigatorSubscription = this.dcs.navigatorStatus$.subscribe(activeNav => {
      this.activeNavigatorNav = activeNav;
      this.selectedAuditIndex = 0;
      this.resetPageInfo();
      if (this.activatedRoute.snapshot.queryParams.tab) {
        this.sot = this.activatedRoute.snapshot.queryParams.tab;
        this.defaultRoute = false;
      }
      this.switchMainTabView(this.sot);
      // this.switchNavigatedOrg(this.activeNavigatorNav);
      // if (this.activeNavigatorNav === 'Basic Details') {
      //   this.switchNavigatedOrg(this.activeNavigatorNav);
      // }
    });
    this.pagerSubscription = this.dcs.pageChange$.subscribe(pager => {
      if (pager) {
        this.pagerInfo = pager;
        if (this.pagerInfo) {
          this.switchNavigatedOrg(this.activeNavigatorNav);
        }
      }
    });
    this.apiStatusSubscription = this.dcs.apiStatus$.subscribe(status => {
      if (status) {
        if (status.status === 'success') {
          this.switchNavigatedOrg(status.action);
        }
      }
    });
  }

  selectDateAccess(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = new Date(event.value ?? new Date());
    if (type === 'fromDateLog') {
      this.dateReqIOC.fromDate = new Date(date).getTime();
      this.minDate = this.dcs.minDate(date);
    }
    if (type === 'toDateLog') {
      this.dateReqIOC.toDate = new Date(date).getTime();
      if (this.dateReqIOC.fromDate) {
        //  this.queryAccessLog();
      }
    }
  }

  selectDate($event: any) {
    this.endMinDate = $event;
  }
  XMLTree(xmlString: string, indent: string) {
    indent = indent || '\t';
    let tabs = '';
    // tslint:disable-next-line: prefer-const
    const result = xmlString.replace(/\s*<[^>/]*>[^<>]*<\/[^>]*>|\s*<.+?>|\s*[^<]+/g, function (m, i) {
      m = m.replace(/^\s+|\s+$/g, '');
      // tslint:disable-next-line: curly
      if (i < 38) {
        // tslint:disable-next-line: curly
        if (/^<[?]xml/.test(m)) {
          return m + '\n';
        }
      }
      if (/^<[/]/.test(m)) {
        // tslint:disable-next-line: one-line
        tabs = tabs.replace(indent, '');
        m = tabs + m;
      }
      // tslint:disable-next-line: one-line
      else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(m)) {
        m = m.replace(/(<[^/>]*)><[/][^>]*>/g, '$1 />');
        m = tabs + m;
      }
      // tslint:disable-next-line: one-line
      else if (/<.*>/.test(m)) {
        m = tabs + m;
        tabs += indent;
      }
      // tslint:disable-next-line: one-line
      else {
        m = tabs + m;
      }
      return '\n' + m;
    });
    return result;
  }
  ngOnInit() {
    this.s3BaseImgUrl = this.dataService.getS3BaseIconsUrl();
    this.loggedinUserDet = this.dcs.getLoggedUser();
    this.isRootOrg = this.dcs.checkRootOrg();
    this.isDRDPremium = this.dcs.isDRD();
    this.isAnalyst = this.dcs.checkAnalyst();
    this.createForm();
    if (this.isRootOrg) {
      // this.orgTopNav.push({ name: 'Config', id: 'config', active: true });
      this.orgTopNav.push({ name: 'Report Config', id: 'reportConfig', active: true, ac: false });
      this.orgTopNav.push({ name: 'Subscriptions', id: 'subscriptions', active: true, ac: false });
      // this.orgTopNav.push({ name: 'Feed Setup', id: 'FS', active: true, ac: false });
      this.orgTopNav.push({ name: 'Reports', id: 'reports', active: true, ac: false });

      // this.orgTopNav.push({ name: 'Alerts Config', id: 'alertsConfig', active: true, ac: false });
    }
    if (this.isDRDPremium) {
      const activeNavs = ['bd', 'drd', 'drd-dk', 'drd-company'];
      this.updateOrgTopNav(activeNavs);
    }
    if (this.isAnalyst) {
      const activeNavs = ['drk-temp'];
      this.orgTopNav.forEach(_navItem => {
        if (activeNavs.indexOf(_navItem.id) > -1) {
          _navItem.active = true;
        }
      });
    }
    (<HTMLInputElement>document.getElementById('iocXml')).innerHTML = this.XMLTree(this.xml, '');
    // if (this.dcs.checkAnalyst() || this.dcs.checkCustomerSupport()) {
    //   this.orgTopNav.forEach((_navItem) => {
    //     if (_navItem.id === 'drd' || _navItem.id === 'drd-dk') {
    //       _navItem.active = true;
    //     }
    //   });
    // }
    this.orgUsersDet.orgUserLimit = 0;
    this.orgUsersDet.orgUserCount = 0;
    this.searchCveStix = '';
    this.basicInfo();
    // this.xml = JSON.parse(this.xml);
    // this.activeNavigatorNav = 'Basic Details';
    // this.switchNavigatedOrg(this.activeNavigatorNav);
    this.modules = [
      // tslint:disable-next-line:max-line-length
      {
        moduleName: 'Cyber Incident Analytics',
        active: false,
        subscribed: false,
        description:
          'The solution provide a) Insights into cyber threats and risks applicable to organization. Provide strategic, management and tactical cyber threat intelligence.  b) Early indicator of latest developments in the cyber domain including latest industry specific news, regulatory change, new hacks, vulnerability and exploits. c) Analyze malicious emails/files using public and commercial sandbox and correlate automatically with threat landscape to present affiliations to any threat actors, details of campaign and attribution',
      },
      {
        moduleName: 'Threat Visibility and Intelligence',
        active: false,
        subscribed: false,
        description:
          'The solution provide a) Insights into cyber threats and risks applicable to organization. Provide strategic, management and tactical cyber threat intelligence.  b) Early indicator of latest developments in the cyber domain including latest industry specific news, regulatory change, new hacks, vulnerability and exploits. c) Analyze malicious emails/files using public and commercial sandbox and correlate automatically with threat landscape to present affiliations to any threat actors, details of campaign and attribution',
      },
      // tslint:disable-next-line:max-line-length
      {
        moduleName: 'Cyber Situational Awareness',
        active: false,
        subscribed: false,
        description:
          'The solution provide a) Insights into cyber threats and risks applicable to organization. Provide strategic, management and tactical cyber threat intelligence.  b) Early indicator of latest developments in the cyber domain including latest industry specific news, regulatory change, new hacks, vulnerability and exploits. c) Analyze malicious emails/files using public and commercial sandbox and correlate automatically with threat landscape to present affiliations to any threat actors, details of campaign and attribution',
      },
      {
        moduleName: 'Cyber Education',
        active: false,
        noofCampaign: '',
        subscribed: false,
        description:
          'The solution will deliver intelligence driven cyber education and social engineering simulations to provide latest attack vectors , mechanism and methods used by hackers',
      },
      // tslint:disable-next-line:max-line-length
      {
        moduleName: 'Cyber Vulnerability Analytics',
        active: false,
        subscribed: false,
        description:
          'A solution to integrate external vulnerability assessment results with cyber threat visibility and intelligence module to provide customers vulnerability insights with detailed mapping to available exploits, other IOCs, associated threat actor, motive and mechanism – enabling vulnerability remediation prioritization',
      },
      {
        moduleName: 'Cyber Risk Scoring',
        active: false,
        subscribed: false,
        description:
          'The solution delivers an Industry / Client specific Cyber Risk Scoring Assessment; Real-time industry specific cyber risk scoring encompassing financial / reputational / operational risks with all 45 cyber security domains',
      },
      // tslint:disable-next-line:max-line-length
      {
        moduleName: 'Brand/Individual Cyber Risk Monitoring',
        active: false,
        subscribed: false,
        description:
          'A solution to provide ability to highlight potential infringements to brand or suspicious activity concerning  key executives',
      },
    ];
    this.subscriptionsModule = {
      basicPackage: [
        {
          moduleName: 'Threat Visibility and Intelligence',
          active: false,
          subscribed: false,
          // tslint:disable-next-line:max-line-length
          description:
            'The External Threat Landscape Management module is a powerful platform where data is collected, analysed, correlated against key attributes and presented in a format where both security practitioners and business leaders can take decisive actions.',
        },
        {
          moduleName: 'Cyber Incident Analytics',
          active: false,
          subscribed: false,
          // tslint:disable-next-line:max-line-length
          description:
            'DeCYFIR’s Cyber Incident Analytics (CIA) examines the actual attack evidence, correlates against data uncovered in the dark web, hackers’ forums, closed communities, and other sources to shed light on the attack. These signals are decoded using DeCYFIR’s probability models to showcase affiliations to any threat actors, details of campaign and IOA/IOC.',
        },
        {
          moduleName: 'Cyber Situational Awareness',
          active: false,
          subscribed: false,
          // tslint:disable-next-line:max-line-length
          description:
            'Cyberspace is a constantly evolving environment with new threats and vulnerabilities emerging on a daily basis. Situational awareness provides both a holistic and specific view of threats where organizations can identify, process and comprehend information in real-time.',
        },
        {
          moduleName: 'Cyber Education',
          active: false,
          subscribed: false,
          icon: 'education',
          // tslint:disable-next-line:max-line-length
          description:
            'The solution will deliver intelligence driven cyber education and social engineering simulations to provide latest attack vectors , mechanism and methods used by hackers',
        },
      ],
      modules: [
        {
          moduleName: 'Cyber Education',
          active: false,
          subscribed: false,
          icon: 'education',
          // tslint:disable-next-line:max-line-length
          description:
            'The solution will deliver intelligence driven cyber education and social engineering simulations to provide latest attack vectors , mechanism and methods used by hackers',
        },
        /* {
           moduleName: 'Cyber Vulnerability Analytics', active: false, subscribed: false, icon: 'vulnerable',
           // tslint:disable-next-line:max-line-length
           description: 'A solution to integrate external vulnerability assessment results with cyber threat visibility and intelligence module to provide customers vulnerability insights with detailed mapping to available exploits, other IOCs, associated threat actor, motive and mechanism – enabling vulnerability remediation prioritization'
         },
         {
           moduleName: 'Cyber Risk Scoring', active: false, subscribed: false, icon: 'risk_scoring',
           // tslint:disable-next-line:max-line-length
           description: 'The solution delivers an Industry / Client specific Cyber Risk Scoring Assessment; Real-time industry specific cyber risk scoring encompassing financial / reputational / operational risks with all 45 cyber security domains'
         },
         {
           moduleName: 'Brand/Individual Cyber Risk Monitoring', active: false, subscribed: false, icon: 'monitoring',
           description: 'A solution to provide ability to highlight potential infringements to brand or suspicious activity concerning  key executives'
         }*/
      ],
    };
    this.dataBreachAssetTypes = [
      { title: 'All' },
      { title: 'Project Name' },
      { title: 'File Name' },
      { title: 'Department Name' },
      { title: 'Domain' },
      { title: 'Individuals Name' },
      { title: 'Email Address' },
      { title: 'IP' },
      { title: 'ASN' },
      { title: 'Software' },
      { title: 'Source Code File Name' },
      { title: 'Intellectual Property' },
      { title: 'Copyright Information' },
      { title: 'Twitter' },
      { title: 'Facebook' },
      { title: 'LinkedIn' },
      { title: 'YouTube' },
      { title: 'Product Name' },
      { title: 'Service Name' },
      { title: 'Mobile App' },
      { title: 'Others' },
    ];
    this.drdKWAssetTypes = this.dataBreachAssetTypes.filter(_t => _t.title !== 'Domain');

    this.filteredAnalyst = this.analystsGroup1.valueChanges.pipe(
      startWith<string | any>(''),
      map(value => (typeof value === 'string' ? value : value.analystFirstName)),
      map(value => this._filterOrg(value))
    );
    this.filteredSales = this.salesGroup1.valueChanges.pipe(
      startWith<string | any>(''),
      map(value => (typeof value === 'string' ? value : value.analystFirstName)),
      map(value => this._filterOrg(value))
    );
    this.filteredPresales = this.preSalesGroup1.valueChanges.pipe(
      startWith<string | any>(''),
      map(value => (typeof value === 'string' ? value : value.analystFirstName)),
      map(value => this._filterOrg(value))
    );
  }
  public scrollToAnchor(serialNo: any) {
    this.selectedAPI = 'serial' + serialNo;
    const element = document.querySelector('#' + this.selectedAPI);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }, 100);
    }
    // document.querySelector('#section1').classList.add('atop')
  }
  switchNavigatedOrg(nav: string) {
    this.dcs.setAjexStatus(true);
    const odreq: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,ASC'],
    };
    const required: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,ASC'],
    };
    const event = {
      index: this.selectedAuditIndex,
    };
    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,DESC'],
    };
    switch (nav) {
      case 'Basic Details':
        this.orgId = parseInt(this.params.id, 10);
        this.orgDetailsService.read(this.selectedKey, this.orgId, odreq).subscribe(
          (res: HttpResponse<OrgDetails[]>) => {
            this.dcs.setAjexStatus(false);
            const totalItems: any = res.headers.get('X-Total-Count');
            this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
            this.orgDetailsList = res.body!;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.getActivePackage(this.orgId);
        break;
      case 'Users':
        this.searchUsers = '';
        this.load(nav);
        break;
      case 'Assets':
        this.load(nav);
        break;
      case 'Digital Risk Keywords':
        // this.assetType = this.dataBreachAssetTypes ? this.dataBreachAssetTypes[0] : { title: 'All', key: 'assettype' };
        this.load(nav);
        break;
      case 'Digital Risk Keywords (Temp)':
        this.load(nav);
        break;
      case 'Roles':
        this.load(nav);
        break;
      case 'Reports':
        this.orgId = parseInt(this.params.id, 10);
        this.orgReportRecipientService.query(this.orgId, required).subscribe(
          (res: HttpResponse<OrgReportFrequency[]>) => {
            this.dcs.setAjexStatus(false);
            const totalItems: any = res.headers.get('X-Total-Count');
            this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
            this.orgReportRecipientsList = res.body!;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Subscriptions':
        this.subscriptionActions.scale = false;
        setTimeout(() => {
          this.subscriptionActions.scale = true;
        }, 500);
        this.orgId = parseInt(this.params.id, 10);
        this.orgSubscriptionService.query(this.orgId).subscribe(
          (res: HttpResponse<OrgSubscription[]>) => {
            this.dcs.setAjexStatus(false);
            const totalItems: any = res.headers.get('X-Total-Count');
            this.dcs.setTotalRecords(totalItems, res.body!.length, 10);
            this.orgSubscriptionList = res.body ? res.body.filter((_sm: any) => {
              if (_sm.moduleName === 'Brand/Individual Cyber Risk Monitoring' || _sm.moduleName === 'Cyber Risk Scoring' || _sm.moduleName === 'Cyber Vulnerability Analytics') {
                return false;
              } else {
                return true;
              }
            }) : [];
            this.subscriptionsModule.basicPackage.map((_module: { active: boolean }) => {
              _module.active = false;
            });
            if (this.orgSubscriptionList.length) {
              this.orgSubscriptionList.map(_orgSubs => {
                if (this.basicModules.indexOf(_orgSubs.moduleName) !== -1) {
                  this.subscriptionsModule.basicPackage.map(
                    (_module: { moduleName: any; active: boolean; startDate: any; endDate: any }) => {
                      if (_orgSubs.moduleName === _module.moduleName) {
                        _module.active = true;
                        _module.startDate = _orgSubs.startDate;
                        _module.endDate = _orgSubs.endDate;
                      } else {
                        // _module.active = false;
                      }
                    }
                  );
                } else {
                  const bpi: number = this.basicModules.indexOf(_orgSubs.moduleName);
                  this.subscriptionsModule.basicPackage[bpi].active = false;
                  // this.subscriptionsModule.modules.map((_module) => {
                  //   if (_orgSubs.moduleName === _module.moduleName) {
                  //     _module.active = true;
                  //     _module.startDate = _orgSubs.startDate;
                  //     _module.endDate = _orgSubs.endDate;
                  //   } else {
                  //     _module.active = false;
                  //   }
                  // });
                }
              });
            } else {
              this.subscriptionsModule.basicPackage.map((_module: { active: boolean; startDate: any; endDate: any }) => {
                _module.active = false;
                _module.startDate = null;
                _module.endDate = null;
              });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Api':
      case 'API':
        this.orgService.find(this.params.id).subscribe(
          (res: HttpResponse<Org>) => {
            this.dcs.setAjexStatus(false);
            // const totalItems: any = res.headers.get('X-Total-Count');
            this.orgBasicDetails = res.body;
            this.stixXmlUrl = this.getHost() + `core/api-ua/threatioc/stix-xml?delta=true&all=false&key=` + this.orgBasicDetails.apiKey;
            this.stixJsonUrl = this.getHost() + `core/api-ua/threatioc/stix-json?delta=true&all=false&key=` + this.orgBasicDetails.apiKey;
            this.iocCsv = this.getHost() + `core/api-ua/threatioc/csv?delta=true&all=false&key=` + this.orgBasicDetails.apiKey;
            this.stixThreatActorJsonUrl = this.getHost() + `core/api-ua/threatactor/stix-json?key=` + this.orgBasicDetails.apiKey;
            this.stixVulnerbilityJsonUrl = this.getHost() + `core/api-ua/vulnerability/stix-json?key=` + this.orgBasicDetails.apiKey;
            this.stixThreatIoc21Url =
              this.getHost() + `core/api-ua/threatioc/stix/v2.1?delta=true&all=false&key=` + this.orgBasicDetails.apiKey;
            this.sitxThreatActorJson21Url =
              this.getHost() + `core/api-ua/threatactor/stix/v2.1?key=` + this.orgBasicDetails.apiKey + `&name=` + 'Fancy Bear';
            this.sitxThreatActorJson21Html = this.getHost() + `core/api-ua/threatactor/stix/v2.1?key=` + this.orgBasicDetails.apiKey;
            this.stixVulnerbilityJson21Url =
              this.getHost() + `core/api-ua/vulnerability/stix/v2.1?key=` + this.orgBasicDetails.apiKey + `&cve=` + 'CVE-2020-7238';
            this.stixVulnerbilityJson21Url1 = this.getHost() + `core/api-ua/vulnerability/stix/v2.1?key=` + this.orgBasicDetails.apiKey;
            this.stixCompromisedUserDetailsJson21Url =
              this.getHost() + `core/api-ua/user-account/stix/v2.1?key=` + this.orgBasicDetails.apiKey;
            // tslint:disable-next-line:max-line-length
            this.searchThreatIocJson21Url =
              this.getHost() +
              `core/api-ua/threatioc/stix/v2.1/search?key=` +
              this.orgBasicDetails.apiKey +
              `&indicatorType=` +
              'CVE' +
              `&value=` +
              'CVE-2003-0845';
            this.stixVulnerbilityJson21Html = this.getHost() + `core/api-ua/vulnerability/stix/v2.1?key=` + this.orgBasicDetails.apiKey;
            this.iocOrgCsv.org24hrs = this.getHost() + `core/api-ua/threatioc/csv?delta=false&all=false&key=` + this.orgBasicDetails.apiKey;
            this.iocOrgCsv.orgAll = this.getHost() + `core/api-ua/threatioc/csv?delta=false&all=true&key=` + this.orgBasicDetails.apiKey;
            this.iocOrgCsv.org24hrsWithRiskScore =
              this.getHost() + `core/api-ua/threatioc/csv?delta=false&all=false&with-risk-score=true&key=` + this.orgBasicDetails.apiKey;
            this.iocOrgCsv.orgAllWithRiskScore =
              this.getHost() + `core/api-ua/threatioc/csv?delta=false&all=true&with-risk-score=true&key=` + this.orgBasicDetails.apiKey;
            this.taxiiXmlUrl = this.getHost() + `core/api-ua/threatioc/taxii-xml?delta=true&all=false&key=` + this.orgBasicDetails.apiKey;
            this.stixalertsjsonurl = this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=impersonation`;
            this.exploitalertsjsonurl = this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=exploit`;
            this.attacksurfacealertsjsonurl =
              this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=Attack_Surface`;
            this.certificateAlertsJsonUrl =
              this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=Certificates`;
            this.PhishingJsonUrl = this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=phishing`;
            this.alertVulnerabilityUrl =
              this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=vulnerability`;
            this.ipWithVulnerabilityUrl =
              this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=IP_With_Vulnerability`;
            this.dataleakJsonUrl = this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=Data_Leak`;
            this.brandInfrigementUrl =
              this.getHost() + `core/api-ua/alerts?key=` + this.orgBasicDetails.apiKey + `&category=Brand_Infringement`;
            this.stixriskdossierjsonurl =
              this.getHost() +
              `core/api-ua/risk-dossier?key=` +
              this.orgBasicDetails.apiKey +
              `&indicatorType=` +
              'IP' +
              `&value=` +
              '209.99.40.222';
            this.impdatadiscoverUrl =
              this.getHost() + `core/api-ua/data/impersonation?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.attacksurfacedatadiscoverUrl =
              this.getHost() + `core/api-ua/data/attack-surface?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.certificatedatadiscoverUrl =
              this.getHost() + `core/api-ua/data/certificates?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.dataleakdatadiscoverUrl =
              this.getHost() + `core/api-ua/data/data-leak?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.brandInfrigementdatadiscoverUrl =
              this.getHost() + `core/api-ua/data/brand-infringement?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.ipWithVulnerabilitydatadiscoverUrl =
              this.getHost() + `core/api-ua/data/ip-with-vulnerability?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.vulnerabilitydatadiscoverUrl =
              this.getHost() + `core/api-ua/data/vulnerability?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.exploitadatadiscoverurl =
              this.getHost() + `core/api-ua/data/exploit?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.PhishingdatadiscoverUrl =
              this.getHost() + `core/api-ua/data/phishing?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.malwaredatadiscoverUrl =
              this.getHost() + `core/api-ua/data/malware?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.campaigndatadiscoverUrl =
              this.getHost() + `core/api-ua/data/campaign?key=` + this.orgBasicDetails.apiKey + `&page=1&size=500`;
            this.openportjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=open-ports&key=` + this.orgBasicDetails.apiKey;
            this.ipvulnerajsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=ip-vulnerability&key=` + this.orgBasicDetails.apiKey;
            this.cofigurationjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=configuration&key=` + this.orgBasicDetails.apiKey;
            this.cloudWeaknessjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=cloud-weakness&key=` + this.orgBasicDetails.apiKey;
            this.ipreputionjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=ip-reputation&key=` + this.orgBasicDetails.apiKey;
            this.certificatejsonurl =
              this.getHost() + `core/api-ua/v2/alerts/attack-surface?type=certificates&key=` + this.orgBasicDetails.apiKey;
            this.domainItAssetsjsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/impersonation-and-infringement?type=domain-it-asset&key=` +
              this.orgBasicDetails.apiKey;
            this.excutivePeoplejsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/impersonation-and-infringement?type=executive-people&key=` +
              this.orgBasicDetails.apiKey;
            this.productSolutionjsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/impersonation-and-infringement?type=product-solution&key=` +
              this.orgBasicDetails.apiKey;
            this.socalHendlerjsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/impersonation-and-infringement?type=social-handlers&key=` +
              this.orgBasicDetails.apiKey;
            this.phishingjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/data-breach-and-web-monitoring?type=phishing&key=` + this.orgBasicDetails.apiKey;
            this.ransomwarejsonurl =
              this.getHost() + `core/api-ua/v2/alerts/data-breach-and-web-monitoring?type=ransomware&key=` + this.orgBasicDetails.apiKey;
            this.sourceCodejsonurl =
              this.getHost() + `core/api-ua/v2/alerts/social-and-public-exposure?type=source-code&key=` + this.orgBasicDetails.apiKey;
            this.maliciousMobileAppsjsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/social-and-public-exposure?type=malicious-mobile-apps&key=` +
              this.orgBasicDetails.apiKey;
            this.confidentialFilesjsonurl =
              this.getHost() +
              `core/api-ua/v2/alerts/social-and-public-exposure?type=confidential-files&key=` +
              this.orgBasicDetails.apiKey;
            this.pIICIIjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/social-and-public-exposure?type=dumps-pii-cii&key=` + this.orgBasicDetails.apiKey;
            this.darkwebjsonurl =
              this.getHost() + `core/api-ua/v2/alerts/data-breach-and-web-monitoring?type=dark-web&key=` + this.orgBasicDetails.apiKey;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Audit':
        this.selectedAuditIndex = this.selectedAuditIndex ? this.selectedAuditIndex : 0;
        this.onAuditTabChange(event);
        break;
      case 'Config':
        this.resetSnapshotConfig();
        this.s3BaseImgUrl = this.dataService.getS3BaseIconsUrl('latest');
        this.selectedConfigIndex = 0;
        this.onConfigTabChange({ index: 0 });
        break;
      case 'Feed Setup':
        this.feedsTypes = this.dcs.getFeedsTypes();
        this.getClientFeeds();
        if (this.isRootOrg) {
          this.loadOrgs();
        }
        break;
      case 'Digital Risk Discovery':
        this.getDrdDomains();
        break;
      case 'DRD Company':
        this.getDRDCompany();
        break;
      case 'Domain Keywords':
        if (this.drdDomains?.length) {
          this.drdKeywordDomains = this.drdDomains.map(_dm => ({ domain: _dm.domain, id: _dm.id }));
          if (this.selectedDomain.id) {
            this.dcs.setAjexStatus(true);
            const dkReq = {
              orgId: parseInt(this.params.id, 10),
              drdDomainId: this.selectedDomain.id,
            };
            this.orgDetailsService.getDRDDomainKeywords(dkReq).subscribe(
              (res: HttpResponse<any[]>) => {
                this.dcs.setAjexStatus(false);
                this.drdSDKeywords = res.body!;
              },
              (error: HttpErrorResponse) => this.onError(error)
            );
          } else {
            this.dcs.setAjexStatus(false);
            this.snackbar.open('Please Select Domain First !', '', {
              duration: 4000,
            });
          }
        } else {
          this.getDrdDomains();
        }
        break;
      case 'Report Config':
        this.orgId = parseInt(this.params.id, 10);
        this.orgReportConfigService.query(this.orgId, req).subscribe(
          (res: HttpResponse<OrgReportConfig[]>) => {
            this.dcs.setAjexStatus(false);
            const totalItems: any = res.headers.get('X-Total-Count');
            this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
            this.orgReportConfigList = res.body!;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Alerts Config':
        this.orgId = parseInt(this.params.id, 10);
        this.isalertConfigLoaded = false;
        this.orgReportConfigService.getAlertsConfig(this.orgId).subscribe(
          (res: any) => {
            this.dcs.setAjexStatus(false);
            if (res?.body && res.body.length > 0) {
              this.alertConfigData = res.body[0];
              this.alertsConfigMap(res);
            } else {
              this.alertConfigData = this.alertConfigForm.value;
              this.alertConfigData.orgId = this.orgId;
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      case 'Third Party Domain':
        this.getTPD();
        break;
      default:
        return;
    }
  }
  blurString(str: string) {
    return "<label class='blur-text'>" + str + '</label>';
    // return str.replace(this.orgBasicDetails.apiKey,"<label class='blur-text'>"+this.orgBasicDetails.apiKey+"</label>")
  }
  alertsConfigMap(res: any) {
    (<FormGroup>this.alertConfigForm.controls.certificates).setValue(res.body[0].certificates, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.impersonation).setValue(res.body[0].impersonation, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.brandInfringement).setValue(res.body[0].brandInfringement, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.vulnerability).setValue(res.body[0].vulnerability, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.dataLeak).setValue(res.body[0].dataLeak, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.ipWithVulnerability).setValue(res.body[0].ipWithVulnerability, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.phishing).setValue(res.body[0].phishing, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.configurations).setValue(res.body[0].configurations, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.openPorts).setValue(res.body[0].openPorts, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.cloudWeakness).setValue(res.body[0].cloudWeakness, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.ipDomainReputation).setValue(res.body[0].ipDomainReputation, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.impersonationAndInfringement).setValue(res.body[0].impersonationAndInfringement, {
      onlySelf: true,
    });
    (<FormGroup>this.alertConfigForm.controls.socialAndPublicExposure).setValue(res.body[0].socialAndPublicExposure, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.dataBreachAndWebMonitoring).setValue(res.body[0].dataBreachAndWebMonitoring, {
      onlySelf: true,
    });
    (<FormGroup>this.alertConfigForm.controls.email).setValue({ email: res.body[0].email }, { onlySelf: true });
    (<FormGroup>this.alertConfigForm.controls.consolidated).setValue({ consolidated: res.body[0].consolidated }, { onlySelf: true });
    if (res.body[0].email === true) {
      this.isEmailChecked = true;
      this.emailId = res.body[0].emailIds;
    }
    this.bcc = res.body[0].bcc;
  }

  chanageAlertConfig(alertConfigForm: string, prop: string, $event: { checked: boolean }) {
    this.alertConfigForm.controls[alertConfigForm].value[prop] = $event.checked;
    if (prop === 'email') {
      this.isEmailChecked = $event.checked;
    }
    if (alertConfigForm === 'vulnerability') {
      if (!this.alertConfigForm.controls.vulnerability.value.isAsset) {
        this.alertConfigForm.controls.vulnerability.value.isVersionOnly = false;
      }
    }
  }
  saveAlertConfig() {
    if ((this.alertConfigForm.controls.vulnerability.value.isCritical || this.alertConfigForm.controls.vulnerability.value.isHigh ||
      this.alertConfigForm.controls.vulnerability.value.isMedium || this.alertConfigForm.controls.vulnerability.value.isLow) &&
      (!this.alertConfigForm.controls.vulnerability.value.isAsset && !this.alertConfigForm.controls.vulnerability.value.isVendor)) {
      this.isVulnerabilityChecked = false;
      return;
    }
    this.isVulnerabilityChecked = true;
    this.alertConfigData.attackSurface = { ...this.alertConfigForm.controls.attackSurface.value };
    this.alertConfigData.certificates = { ...this.alertConfigForm.controls.certificates.value };
    this.alertConfigData.impersonation = { ...this.alertConfigForm.controls.impersonation.value };
    this.alertConfigData.brandInfringement = { ...this.alertConfigForm.controls.brandInfringement.value };
    this.alertConfigData.vulnerability = { ...this.alertConfigForm.controls.vulnerability.value };
    this.alertConfigData.dataLeak = { ...this.alertConfigForm.controls.dataLeak.value };
    this.alertConfigData.ipWithVulnerability = { ...this.alertConfigForm.controls.ipWithVulnerability.value };
    this.alertConfigData.phishing = { ...this.alertConfigForm.controls.phishing.value };
    this.alertConfigData.impersonationAndInfringement = this.alertConfigForm.controls.impersonationAndInfringement.value;
    this.alertConfigData.socialAndPublicExposure = this.alertConfigForm.controls.socialAndPublicExposure.value;
    this.alertConfigData.dataBreachAndWebMonitoring = this.alertConfigForm.controls.dataBreachAndWebMonitoring.value;
    this.alertConfigData.configurations = this.alertConfigForm.controls.configurations.value;
    this.alertConfigData.openPorts = this.alertConfigForm.controls.openPorts.value;
    this.alertConfigData.ipDomainReputation = this.alertConfigForm.controls.ipDomainReputation.value;
    this.alertConfigData.cloudWeakness = this.alertConfigForm.controls.cloudWeakness.value;
    this.alertConfigData.email = this.alertConfigForm.controls.email.value.email;
    this.alertConfigData.consolidated = this.alertConfigForm.controls.consolidated.value.consolidated;
    this.alertConfigData.bcc = this.bcc;
    this.alertConfigData.emailIds = this.isEmailChecked ? this.emailId : null;
    this.orgReportConfigService.postAlertsConfig(this.alertConfigData).subscribe(res => {
      this.alertConfigData = res.body;
      this.dialog.open(MatDialogComponent, {
        width: '300px',
        height: '270px',
        disableClose: false,
        data: { action: 'API_SUCCESS', message: 'Saved Successfully' },
      });
    });
  }
  // get drd domains by id
  getDrdDomains() {
    this.dcs.setAjexStatus(true);
    const drdReq = {
      orgId: parseInt(this.params.id, 10),
    };
    this.orgDetailsService.getDRDDomains(drdReq).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dcs.setAjexStatus(false);
        this.drdDomains = res.body!;
        if (this.sot === 'Domain Keywords') {
          this.drdKeywordDomains = this.drdDomains.map(_dm => ({ domain: _dm.domain, id: _dm.id }));
        }
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }
  // get drd company DEC-1175
  getDRDCompany() {
    this.dcs.setAjexStatus(true);
    const drdCompanyReq = {
      orgId: parseInt(this.params.id, 10),
    };
    this.orgDetailsService.getDRDCompany(drdCompanyReq).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dcs.setAjexStatus(false);
        this.drdCompany = res.body!;
        /*  if (this.sot === 'Domain Keywords') {
         this.drdKeywordDomains = this.drdCompany.map((_dm) => {
           return {domain: _dm.domain, id: _dm.id};
         });
       } */
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  drdDomainSelection() {
    this.switchNavigatedOrg(this.sot);
  }
  compareDRDDomains(o1: any, o2: any): boolean {
    return o1.domain === o2.domain && o1.id === o2.id;
  }
  // save snapshot config
  saveSnapshotConfig() {
    const reqObj: any = {
      orgId: parseInt(this.params.id, 10),
      id: this.configObjectId,
    };
    this.snapshotConfigList.map(_config => {
      reqObj[_config.name] = { active: _config.active, system: _config.system, analyst: _config.analyst, keywords: _config.keywords };
    });
    this.ctds.setSnapshotConfig(reqObj).subscribe(
      response => {
        if (response.status) {
          this.dialog.open(MatDialogComponent, {
            width: '300px',
            height: '270px',
            disableClose: false,
            data: { action: 'API_SUCCESS', message: 'Configured Successfully' },
          });
        }
      },
      error => this.onError(error)
    );
  }
  // reset snapshot config
  resetSnapshotConfig(): void {
    this.snapshotConfigList = [];
    this.dcs.setAjexStatus(true);
    this.snapshotConfigList = this.dataService.getSnapConfig().slice(0);
    this.ctds.getSnapshotConfig(this.params.id).subscribe(
      Response => {
        this.dcs.setAjexStatus(false);
        const configResponse: any = Response.body;
        this.configObjectId = String(configResponse.id);
        this.snapshotConfigList.forEach(key => {
          key.active = configResponse[key.name].active;
          key.system = configResponse[key.name].system;
          key.analyst = configResponse[key.name].analyst;
          key.keywords = configResponse[key.name].keywords;
        });
      },
      error => this.onError(error)
    );
    setTimeout(() => {
      (<HTMLInputElement>document.getElementById('resetSnapshotConfig')).setAttribute('disabled', 'true');
      (<HTMLInputElement>document.getElementById('saveSnapshotConfig')).setAttribute('disabled', 'true');
    }, 300);
  }
  checkConfigChangeDetection() {
    (<HTMLInputElement>document.getElementById('resetSnapshotConfig')).removeAttribute('disabled');
    (<HTMLInputElement>document.getElementById('saveSnapshotConfig')).removeAttribute('disabled');
  }
  generateKeywords(keywords: any) {
    keywords.split(',').map((_keywords: string) => this.selectedConfigKeywords.keywords.push(_keywords));
    this.checkConfigChangeDetection();
  }
  getKeywords(): string[] {
    if (this.selectedConfigKeywords.keywords?.length) {
      return this.selectedConfigKeywords.keywords;
    } else {
      return [];
    }
  }
  removeKeywords(keyword: string) {
    this.selectedConfigKeywords.keywords = this.selectedConfigKeywords.keywords.filter((_keywords: string) => _keywords !== keyword);
  }
  getKeys(key: string) {
    this.selectedKey = key;
    this.resetPageInfo();
    this.switchNavigatedOrg('Basic Details');
  }
  // compare to update multiple analysts
  compare(c1: { analystId: number }, c2: { analystId: number }) {
    return c1 && c2 && c1.analystId === c2.analystId;
  }
  openDialog(type: string, selectedData?: any) {
    this.orgId = parseInt(this.params.id, 10);
    if (type === 'create') {
      this.dialog.open(OrgDialogComponent, {
        width: '60%',
        height: '70%',
        disableClose: true,
        data: { action: 'createOrg', label: 'Create Organisation' },
      });
    } else if (type === 'drd-company') {
      // DEC-1175
      const actionData: any = { action: type, label: 'Add Company', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Company';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '70%',
        height: '45%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'createOrgDetails') {
      const actionData: any = { action: 'orgDetails', label: 'Add Attributes', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Attributes';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '50%',
        height: '35%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'editOrgDetails') {
      this.dialog.open(OrgDialogComponent, {
        width: '60%',
        height: '75%',
        disableClose: true,
        data: { action: type, label: 'Update Organisation Details' },
      });
    } else if (type === 'createOrgUser') {
      const actionData: any = { action: type, label: 'Add User', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update User';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '60%',
        height: '50%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'createOrgAssets') {
      const actionData: any = { action: type, label: 'Add Asset', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Asset';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '50%',
        height: '45%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'setupReports') {
      const actionData: any = { action: type, label: 'Setup Reports', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Reports';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '80%',
        height: '80%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'ViewReports') {
      const actionData: any = { action: type, label: 'View Reports' };
      if (selectedData) {
        actionData.action = 'ViewReports';
        actionData.label = 'View Reports';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '90%',
        height: '90%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'createDataBreachAsset') {
      const actionData: any = { action: type, label: 'Add Asset', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Asset';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '50%',
        height: '60%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'addClientsFeeds') {
      const actionData: any = { action: type, label: 'Add Feeds', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Feeds';
        actionData.data = selectedData;
      }
      const dialogRef = this.dialog.open(OrgDialogComponent, {
        width: '70%',
        height: '35%',
        disableClose: true,
        data: actionData,
      });
      dialogRef.afterClosed().subscribe(formData => {
        if (formData) {
          this.dcs.setAjexStatus(true);
          if (selectedData) {
            const reqObj = {
              orgId: this.orgId,
              id: selectedData.id,
              type: formData.type,
              source: formData.source,
            };
            this.feedService.updateClientSource(reqObj).subscribe(
              res => {
                this.dcs.setAjexStatus(false);
                this.dialog.open(MatDialogComponent, {
                  width: '300px',
                  height: '270px',
                  disableClose: false,
                  data: { action: 'API_SUCCESS', message: 'Updated Successfully' },
                });
                this.getClientFeeds();
              },
              err => this.onError(err)
            );
          } else {
            const reqObj = {
              orgId: this.orgId,
              type: formData.type,
              source: formData.source,
            };
            this.feedService.createClientSource(reqObj).subscribe(
              res => {
                this.dcs.setAjexStatus(false);
                if (res) {
                  this.dialog.open(MatDialogComponent, {
                    width: '300px',
                    height: '270px',
                    disableClose: false,
                    data: { action: 'API_SUCCESS', message: 'Created Successfully' },
                  });
                }
                this.getClientFeeds();
              },
              err => this.onError(err)
            );
          }
        }
      });
    } else if (type === 'drd-domain') {
      const actionData: any = { action: type, label: 'Add Domain', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Domain';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '70%',
        height: '45%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'drd-domain-keywords') {
      const actionData: any = { action: type, label: 'Add Domain Keywords', orgId: this.orgId, drdId: this.selectedDomain.id };
      if (selectedData) {
        actionData.label = 'Update Domain Keywords';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '70%',
        height: '35%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'drd-domain-keywords-check') {
      const actionData: any = { action: type, label: 'Click Here', orgId: this.orgId, drdId: this.selectedDomain.id };

      if (selectedData) {
        actionData.label = 'Check Keywords';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '50%',
        height: '35%',
        disableClose: false,
        data: actionData,
      });
    } else if (type === 'createReportConfig') {
      const actionData: any = { action: type, label: 'Setup Report Config', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Report Config';
        actionData.data = selectedData;
      }
      this.dialog.open(OrgDialogComponent, {
        width: '55%',
        height: '50%',
        disableClose: true,
        data: actionData,
      });
    } else if (type === 'createAlertsConfig') {
      // const actionData: any = { action: type, label: 'Setup Alert Config', orgId: this.orgId };
      // if (selectedData) {
      //   actionData.label = 'Update Alert Config';
      //   actionData.data = selectedData;
      // }
      this.dialog.open(OrgDialogComponent, {
        width: '55%',
        height: '50%',
        disableClose: true,
        // data: actionData
      });
    } else if (type === 'third-party-domain') {
      const actionData: any = { action: type, label: 'Add Third Party Domain', orgId: this.orgId };
      if (selectedData) {
        actionData.label = 'Update Third Party Domain';
        actionData.data = selectedData;
      }
      const dialogRef = this.dialog.open(OrgDialogComponent, {
        width: '40%',
        height: '40%',
        disableClose: true,
        data: actionData,
      });
      dialogRef.afterClosed().subscribe(formData => {
        if (formData) {
          this.getTPD();
        }
      });
    } else if (type === 'logoDialog') {
      const oldLogo = this.dcs.getLogo();
      const actionData: any = { action: type, label: this.orgBasicDetails.logo ? 'updateLogo' : 'addLogo', orgId: this.orgId, logo: this.orgBasicDetails.logo };
      const dialogRef = this.dialog.open(OrgDialogComponent, {
        width: '600px',
        height: '360px',
        disableClose: true,
        data: actionData
      });
      dialogRef.afterClosed().subscribe((formData) => {
        if (!formData) {
          this.dcs.changeLogo(oldLogo);
        }
      });
    }
  }
  search(value?: number) {
    this.resetPageInfo();
    if (value) {
      this.assetName = '';
      this.action = '';
      this.assetmonitor = value;
    } else if (value === 0) {
      this.assetName = '';
      this.action = '';
      this.assetmonitor = 0;
    } else {
      this.assetmonitor; // = this.assetmonitor;
    }
    const searchBy: any = {
      assetName: this.assetName ? this.assetName : '',
      action: this.action ? this.action : '',
      monitor: this.assetmonitor ? this.assetmonitor : 0,
    };

    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,DESC'],
    };
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.searchqueryAssetAudit(this.orgId, req, searchBy).subscribe(
      (res: HttpResponse<OrgAssetsAudit[]>) => {
        this.dcs.setAjexStatus(false);
        const totalItems: any = res.headers.get('X-Total-Count');
        this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
        this.orgAssetAuditList = res.body!;
        for (let i = 0; i < this.orgAssetAuditList.length; i++) {
          if (this.orgAssetAuditList[i].action === 'ORG_ASSETS_CREATE') {
            this.orgAssetAuditList[i].action = 'CREATE';
          } else if (this.orgAssetAuditList[i].action === 'ORG_ASSETS_UPDATE') {
            this.orgAssetAuditList[i].action = 'UPDATE';
          } else {
            this.orgAssetAuditList[i].action = 'ORG_ASSETS_DELETE';
          }
        }
        if (!this.orgAssetAuditList.length) {
          this.resetPageInfo();
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  // audit subscription
  searchByAction(value?: number) {
    this.resetPageInfo();
    if (value) {
      this.action = '';
    } else if (value === 0) {
      this.action = '';
    }
    const searchBy: any = {
      action: this.action ? this.action : '',
    };

    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,DESC'],
    };
    this.dcs.setAjexStatus(true);
    this.OrgSubscriptionAuditService.searchqueryAuditSub(this.orgId, req, searchBy).subscribe(
      (res: HttpResponse<OrgSubscriptionAudit[]>) => {
        this.dcs.setAjexStatus(false);
        const totalItems: any = res.headers.get('X-Total-Count');
        this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
        this.orgSubscriptionList = res.body ? res.body : [];
        for (let i = 0; i < this.orgSubscriptionList.length; i++) {
          if (this.orgSubscriptionList[i].action === 'CREATE') {
            this.orgSubscriptionList[i].action = 'CREATE';
          } else if (this.orgSubscriptionList[i].action === 'UPDATE') {
            this.orgSubscriptionList[i].action = 'UPDATE';
          }
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  // end of audit subscription

  getClientFeeds(id?: number) {
    const _id = id ? id : this.orgId;
    this.dcs.setAjexStatus(true);
    this.feedService.getClientSourceList(_id).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.clientsFeeds = res.body!;
      },
      err => this.onError(err)
    );
  }
  filterByOrg(id: number) {
    if (id) {
      this.getClientFeeds(id);
    }
  }
  // filter org basic details by org
  // getOrgBasicDetails(orgId: any) {
  //   let foundDetails: any = {};
  //   foundDetails = this.allOrgsList.filter((_org) => {
  //     return _org.id === orgId;
  //   })[0];
  //   return foundDetails;
  // }

  // get all org-details list
  filter(key: string) {
    if (key === 'Digital Risk Keywords') {
      this.resetPageInfo();
      this.load('Digital Risk Keywords');
    } else if (key === 'Assets') {
      this.resetPageInfo();
      this.load('Assets');
    } else if (key === 'Users') {
      this.resetPageInfo();
      this.load('Users');
    }
  }

  load(callStatus: string) {
    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,ASC'],
    };
    this.orgId = parseInt(this.params.id, 10);
    if (callStatus === 'Org Details') {
      this.orgDetailsService.query(req).subscribe(
        (res: HttpResponse<OrgDetails[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgDetailsList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Assets') {
      req.monitor = 0;
      if (this.searchAssets) {
        req.assetType = this.searchAssets;
      } else {
        req.assetType = '';
      }
      this.orgAssetsService.query(this.orgId, req).subscribe(
        (res: HttpResponse<OrgAssets[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgAssetsList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Digital Risk Keywords') {
      // this.resetPageInfo();
      req.monitor = 1;
      if (this.assetType) {
        if (this.assetType === 'All') {
          req.assetType = '';
        } else {
          req.assetType = this.assetType;
        }
      } else {
        req.assetType = '';
      }
      this.orgAssetsService.query(this.orgId, req).subscribe(
        (res: HttpResponse<OrgAssets[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.dataBreachAssetsList = res.body!;
          if (this.dataBreachAssetsList.length > 0) {
            this.dataBreachAssetsList = this.dataBreachAssetsList.map(o => {
              o['checkbox'] = false;
              return o;
            });
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Digital Risk Keywords (Temp)') {
      this.orgAssetsTempService.query(this.orgId, req).subscribe(
        (res: HttpResponse<OrgAssetsTemp[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.dataBreachAssetsTempList = res.body!;
          if (this.dataBreachAssetsTempList.length > 0) {
            this.dataBreachAssetsTempList = this.dataBreachAssetsTempList.map(o => {
              o['checkbox'] = false;
              return o;
            });
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Users') {
      if (this.searchUsers) {
        req.searchValue = this.searchUsers;
      } else {
        req.searchValue = '';
      }
      this.orgUserService.query(this.orgId, req).subscribe(
        (res: HttpResponse<OrgUser[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgUsersList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.orgService.findOrgUserCount(this.orgId).subscribe(
        (res: HttpResponse<Org>) => {
          this.orgUsersCount = res.body;
          this.orgUsersDet.orgUserLimit = this.orgUsersCount.orgUserLimit;
          this.orgUsersDet.orgUserCount = this.orgUsersCount.orgUserCount;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Roles') {
      this.roleService.query(this.orgId, req).subscribe(
        (res: HttpResponse<Role[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.rolesList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (callStatus === 'Domain Keywords') {
      const orgId = parseInt(this.params.id, 10);
      const dkReq = {
        drdDomainId: this.selectedDomain.id,
        drdKWAssetType: '',
      };
      if (this.drdKWAssetType) {
        if (this.drdKWAssetType === 'All') {
          dkReq.drdKWAssetType = '';
        } else {
          dkReq.drdKWAssetType = this.drdKWAssetType;
        }
      } else {
        dkReq.drdKWAssetType = '';
      }
      this.dcs.setAjexStatus(true);
      this.orgDetailsService.filterDRDDomainKeywords(orgId, dkReq).subscribe(
        (res: HttpResponse<any[]>) => {
          this.dcs.setAjexStatus(false);
          this.drdSDKeywords = res.body!;
        },
        (error: HttpErrorResponse) => this.onError(error)
      );
    }
  }

  basicInfo() {
    this.orgUserService.rootOrgAnalyst().subscribe(
      (res: HttpResponse<OrgUser[]>) => {
        this.dcs.setAjexStatus(false);
        this.orgUserAnalysts = res.body!.map(analyst => {
          const tempObj = {
            analystFirstName: analyst.firstname,
            analystId: analyst.id,
            email: analyst.email,
          };
          return tempObj;
        });
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.orgService.find(this.params.id).subscribe(
      (res: HttpResponse<Org>) => {
        this.orgBasicDetails = res.body;
        this.refererType = res.body!.referer;
        this.pov = res.body!.pov;
        if (res.body!.thirdPartyDomainsEnable && this.orgTopNav.findIndex(navItem => navItem.id === 'tpd') < 0) {
          this.orgTopNav.splice(4, 0, { name: 'Third Party Domain', id: 'tpd', active: true, ac: false });
          // this.orgTopNav.push({ name: 'Third Party Domain', id: 'tpd', active: true, ac: false });
        }
        if (this.pov && this.pov === 'TRIAL_POV') {
          const idx = this.orgTopNav.map(e => e.id).indexOf('alertsConfig');
          this.orgTopNav[idx].active = false;
        }
        if (this.refererType && this.refererType.toLowerCase() === INTEGRATION_TYPE[0]) {
          const activeNavs = ['bd', 'assets', 'drk'];
          this.updateOrgTopNav(activeNavs);
          this.dcs.updateRefererType(this.refererType);
        }
        if (Object.keys(this.orgBasicDetails).length) {
          // analyst
          const selectedAnalysts = this.orgBasicDetails.analysts.map((analystObj: any) => {
            const tempObj = {
              analystFirstName: analystObj.analystFirstName,
              analystId: analystObj.analystId,
            };
            return tempObj;
          });
          selectedAnalysts.length ? this.analystsGroup.setValue(selectedAnalysts) : (this.analystsGroup = new FormControl());
          this.selectedAnalystsList = selectedAnalysts;
          // sales
          const selectedSalesAnalysts = this.orgBasicDetails.salesObject.map((analystObj: any) => {
            const tempObj = {
              analystFirstName: analystObj.salesFirstName,
              salesId: analystObj.salesId,
              email: analystObj.salesEmail,
              analystId: analystObj.salesId,
            };
            return tempObj;
          });
          selectedSalesAnalysts.length ? this.salesGroup.setValue(selectedSalesAnalysts) : (this.salesGroup = new FormControl());
          this.sdSalesList = selectedSalesAnalysts;
          // presales
          const selectedPresalesAnalysts = this.orgBasicDetails.presalesObject.map((analystObj: any) => {
            const tempObj = {
              analystFirstName: analystObj.salesFirstName,
              salesId: analystObj.salesId,
              email: analystObj.salesEmail,
              analystId: analystObj.salesId,
            };
            return tempObj;
          });
          selectedPresalesAnalysts.length
            ? this.preSalesGroup.setValue(selectedPresalesAnalysts)
            : (this.preSalesGroup = new FormControl());
          this.sdPresalesList = selectedPresalesAnalysts;

          if (this.orgBasicDetails.orgType === 'DRD') {
            this.orgTopNav.forEach(_navItem => {
              if (_navItem.id === 'drd' || _navItem.id === 'drd-dk' || _navItem.id === 'drd-company') {
                _navItem.active = true;
              } else if (_navItem.id === 'assets' || _navItem.id === 'drk') {
                _navItem.active = false;
              }
            });
          }
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.orgService.getCustomerSupportId(this.params.id).subscribe(
      (res: HttpResponse<string[]>) => {
        this.orgCSList = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    // this.orgService.query().subscribe(
    //   (res: HttpResponse<Org[]>) => {
    //     this.dcs.setAjexStatus(false);
    //     this.allOrgsList = res.body;
    //     this.orgBasicDetails = this.getOrgBasicDetails(Number(this.params.id));
    //     if (this.orgBasicDetails) {
    //       this.parentOrgId = this.orgBasicDetails.parentid;
    //       console.log(this.orgBasicDetails);
    //       const selectedAnalysts = this.orgBasicDetails.analysts.map((analystObj) => {
    //         const tempObj = {
    //           'analystFirstName': analystObj.analystFirstName,
    //           'analystId': analystObj.analystId
    //         };
    //         return tempObj;
    //       });
    //       selectedAnalysts.length ? this.analystsGroup.setValue(selectedAnalysts) : this.analystsGroup = new FormControl();
    //     }
    //   },
    //   (res: HttpErrorResponse) => this.onError(res.message)
    // );
    // this.orgId = Number(this.params.id);
    // setTimeout(() => {
    //   this.orgUserService.rootOrgAnalyst().subscribe(
    //     (res: HttpResponse<OrgUser[]>) => {
    //       this.dcs.setAjexStatus(false);
    //       this.orgUserAnalysts = res.body.map((analyst) => {
    //         const tempObj = {
    //           'analystFirstName': analyst.firstname,
    //           'analystId': analyst.id
    //         };
    //         return tempObj;
    //       });
    //     },
    //     (res: HttpErrorResponse) => this.onError(res.message)
    //   );
    // }, 200);
  }

  // delete org records
  remove(id: any) {
    let alertDialogRef;
    if (this.activeNavigatorNav === 'Digital Risk Keywords' || this.sot === 'Third Party Domain' || this.activeNavigatorNav === 'Assets') {
      alertDialogRef = this.dialog.open(MatDialogComponent, {
        width: '400px',
        height: '370px',
        disableClose: true,
        data: {
          action: 'API_ALERT',
          message:
            'The keyword will be deleted immediately, The data discoverd for this keyword will be deleted with in 24 hours.<br><br><br> Are you sure you want to delete?',
        },
      });
    } else {
      alertDialogRef = this.dialog.open(MatDialogComponent, {
        width: '300px',
        height: '270px',
        disableClose: true,
        data: { action: 'API_ALERT', message: 'Are you sure you want to delete?' },
      });
    }

    alertDialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.dcs.setAjexStatus(true);
        if (this.activeNavigatorNav === 'Basic Details') {
          this.orgDetailsList = this.orgDetailsList.filter(o => o.id !== id);
          this.orgDetailsService.delete(id).subscribe(
            res => {
              this.dcs.setAjexStatus(false);
              this.dcs.setApiStatus({ status: 'success', action: 'Basic Details' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
              });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        } else if (this.activeNavigatorNav === 'Users') {
          this.orgUserService.find(id).subscribe(
            res => {
              this.orgUserSingle = res.body;
              this.userService.delete(this.orgUserSingle.email).subscribe(resp => {
                if (resp.status === 200 || resp.statusText === 'OK') {
                  this.orgUsersList = this.orgUsersList.filter(o => o.id !== id);
                  this.orgUserService.delete(id).subscribe(
                    respons => {
                      this.dcs.setAjexStatus(false);
                      this.dcs.setApiStatus({ status: 'success', action: 'Users' });
                      this.dialog.open(MatDialogComponent, {
                        width: '300px',
                        height: '270px',
                        disableClose: false,
                        data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
                      });
                    },
                    (respons: HttpErrorResponse) => this.onError(respons.message)
                  );
                }
              });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        } else if (this.activeNavigatorNav === 'Assets') {
          this.orgAssetsList = this.orgAssetsList.filter(o => o.id !== id);
          this.orgAssetsService.delete(id).subscribe(
            res => {
              this.dcs.setAjexStatus(false);
              this.dcs.setApiStatus({ status: 'success', action: 'Assets' });
              // this.dialog.open(MatDialogComponent, {
              //   width: '300px',
              //   height: '270px',
              //   disableClose: false,
              //   data: { action: 'API_SUCCESS', message: 'Deleted Successfully' }
              // });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        } else if (this.activeNavigatorNav === 'Digital Risk Keywords') {
          this.dataBreachAssetsList = this.dataBreachAssetsList.filter(o => o.id !== id);
          this.orgAssetsService.delete(id).subscribe(
            res => {
              this.dcs.setAjexStatus(false);
              this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Keywords' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
              });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        } else if (this.activeNavigatorNav === 'Reports') {
          this.orgReportRecipientsList = this.orgReportRecipientsList.filter(o => o.id !== id);
          this.orgReportRecipientService.delete(id).subscribe(
            res => {
              this.dcs.setAjexStatus(false);
              this.dcs.setApiStatus({ status: 'success', action: 'Reports' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
              });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        } else if (this.activeNavigatorNav === 'Feed Setup') {
          this.feedService.delete(id).subscribe(
            res => {
              if (res) {
                this.dialog.open(MatDialogComponent, {
                  width: '300px',
                  height: '270px',
                  disableClose: false,
                  data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
                });
                setTimeout(() => {
                  this.getClientFeeds();
                }, 300);
              }
            },
            err => this.onError(err)
          );
        } else if (this.activeNavigatorNav === 'Report Config') {
          this.orgReportConfigService.delete(id).subscribe(
            res => {
              if (res) {
                this.dialog.open(MatDialogComponent, {
                  width: '300px',
                  height: '270px',
                  disableClose: false,
                  data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
                });
                setTimeout(() => {
                  this.switchNavigatedOrg('Report Config');
                }, 300);
              }
            },
            err => this.onError(err)
          );
        } else if (this.sot === 'Domain Keywords') {
          this.orgDetailsService.deleteDRDDomainKeyword(id).subscribe(
            (res: HttpResponse<any>) => {
              this.dcs.setApiStatus({ status: 'success', action: 'Domain Keywords' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
              });
            },
            (error: HttpErrorResponse) => this.onError(error)
          );
        } else if (this.sot === 'DRD Company') {
          this.orgDetailsService.deleteDRDCompanyKeyword(id).subscribe(
            (res: HttpResponse<any>) => {
              //  this.dcs.setApiStatus({ status: 'success', action: 'Domain Keywords' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
              });
            },
            (error: HttpErrorResponse) => this.onError(error)
          );
        } else if (this.sot === 'Third Party Domain') {
          this.deleteTPD(id);
        }
      }
    });
  }

  searchByReportTypeName() {
    const required: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,ASC'],
    };
    const searchBy: any = {};
    searchBy.name = this.searchReportTypes;
    this.orgId = parseInt(this.params.id, 10);
    this.orgReportFrequencyService.search(this.orgId, searchBy, required).subscribe(
      (res: HttpResponse<OrgReportFrequency[]>) => {
        this.dcs.setAjexStatus(false);
        const totalItems: any = res.headers.get('X-Total-Count');
        this.dcs.setTotalRecords(totalItems, res.body!.length, 10);
        this.orgReportFrequencyList = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  // searchByName() {
  //   const searchBy: any = {};
  //   searchBy.name = this.searchAssets;
  //   this.orgId = parseInt(this.params.id, 10);
  //   if (searchBy.name) {
  //     this.dcs.setAjexStatus(true);
  //     this.orgAssetsService.search(this.orgId, searchBy).subscribe((res) => {
  //       this.dcs.setAjexStatus(false);
  //       this.orgAssetsList = res.body;
  //     }, (res: HttpErrorResponse) => this.onError(res.message));
  //   }
  //   else {
  //     const req: any = {
  //       page: this.pagerInfo.currentPage - 1,
  //       size: this.pagerInfo.pageSize,
  //       sort: ['id,ASC']
  //     };
  //     req.monitor = 0;
  //     req.assetType = '';
  //     this.orgAssetsService.query(this.orgId, req).subscribe(
  //       (res: HttpResponse<OrgAssets[]>) => {
  //         this.dcs.setAjexStatus(false);
  //         const totalItems: any = res.headers.get('X-Total-Count');
  //         this.dcs.setTotalRecords(totalItems, res.body.length, this.pagerInfo.pageSize);
  //         this.orgAssetsList = res.body;
  //       }, (res: HttpErrorResponse) => this.onError(res.message)
  //     );
  //   }
  // }

  searchByOrgDetail() {
    const searchBy: any = {};
    searchBy.key = this.searchOrgDetails;
    this.orgId = parseInt(this.params.id, 10);
    this.dcs.setAjexStatus(true);
    this.orgDetailsService.search(this.orgId, searchBy).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.orgDetailsList = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  searchByUser() {
    const searchBy: any = {};
    searchBy.firstname = this.searchUsers;
    this.orgId = parseInt(this.params.id, 10);
    this.dcs.setAjexStatus(true);
    this.orgUserService.search(this.orgId, searchBy).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.orgUsersList = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  /* file upload */
  processFile(event: { target: any }) {
    this.files = event.target.files[0];
    this.fileStatus = event.target.files[0].name;
    event.target.value = null;
  }
  upload(monitor: any): any {
    if (!this.files) {
      alert('Please select file.');
      return false;
    } else {
      if (monitor === 'drd-domains') {
        this.dcs.setAjexStatus(true);
        const req = {
          orgId: parseInt(this.params.id, 10),
        };
        const formData = new FormData();
        formData.append('orgId', '' + req.orgId);
        formData.append('file', this.files);
        this.orgDetailsService.uploadBulkDRDDomains(req, formData).subscribe(
          (res: HttpResponse<any>) => {
            this.dcs.setAjexStatus(false);
            this.files = null;
            this.fileStatus = 'Select File';
            this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Discovery' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else if (monitor === 'drd-domain-keyword') {
        this.dcs.setAjexStatus(true);
        const req = {
          orgId: parseInt(this.params.id, 10),
          drdDomainId: this.selectedDomain.id,
        };
        const formData = new FormData();
        formData.append('orgId', '' + req.orgId);
        formData.append('file', this.files);
        this.orgDetailsService.uploadBulkDRDDomainKeywords(req, formData).subscribe(
          (res: HttpResponse<any>) => {
            this.dcs.setAjexStatus(false);
            this.files = null;
            this.fileStatus = 'Select File';
            this.dcs.setApiStatus({ status: 'success', action: 'Domain Keywords' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else {
        const formData = new FormData();
        formData.append('orgId', '' + this.orgId);
        formData.append('file', this.files);
        this.dcs.setAjexStatus(true);
        this.orgAssetsService.uploadFile(this.orgId, formData, monitor).subscribe(
          response => {
            this.dcs.setAjexStatus(false);
            alert(response.body.message.replace(/~/g, '\n'));
            this.files = null;
            this.fileStatus = 'Select File';
            if (monitor === '0') {
              this.dcs.setApiStatus({ status: 'success', action: 'Assets' });
            } else if (monitor === '1') {
              this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Keywords' });
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
      }
    }
  }
  downloadFileOrgAssets() {
    const monitor = 0;
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.getFile(monitor).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: 'text/csv' });
        saveAs(blob, 'OrgAsset.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  downloadFileDBMonitoringTemplate() {
    const monitor = 1;
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.getFile(monitor).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: 'text/csv' });
        saveAs(blob, 'org_databreach_asset.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  downloadFileDRDDomainTemplate() {
    this.dcs.setAjexStatus(true);
    this.orgDetailsService.getDRDDomainFile().subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: 'text/csv' });
        saveAs(blob, 'DRD_Domain.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  downloadFileDRDDomainKeywordTemplate() {
    this.dcs.setAjexStatus(true);
    this.orgDetailsService.getDRDDomainKeywordFile().subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: 'text/csv' });
        saveAs(blob, 'DRD_Domain_Keyword.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  digitalRiskKeywordDownload() {
    const monitor = 1;
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.digitalRiskKeywordDownload(this.orgBasicDetails.id, monitor).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'digital_risk_keywords.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  drdKeywordDownload() {
    this.dcs.setAjexStatus(true);
    if (!this.drdKWAssetType) {
      this.drdKWAssetType = '';
    }
    const dkReq = {
      orgId: parseInt(this.params.id, 10),
      drdDomainId: this.selectedDomain.id,
      drdKWAssetType: this.drdKWAssetType,
    };
    this.orgDetailsService.drdDomainKeywordDownload(dkReq.orgId, dkReq).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'drd-domain-keywords.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  isSearchValid(): boolean {
    if (this.dateReqIOC.fromDate && this.dateReqIOC.toDate) {
      return true;
    } else {
      return false;
    }
  }

  queryAccessLog() {
    // let pagerReq: PageReq;
    const pagerReqpagerReq: PageReq = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
    };
    if (!this.dateReqIOC.fromDate) {
      this.dateReqIOC.fromDate = 0;
    }
    if (!this.dateReqIOC.toDate) {
      this.dateReqIOC.toDate = 0;
    }
    setTimeout(() => {
      this.dcs.setAjexStatus(true);
      this.orgAssetsService.queryAccessLog(this.pagerReq, this.orgId, this.dateReqIOC).subscribe(
        (res: HttpResponse<any>) => {
          // const totalItems: any = res.headers.get('X-Total-Count');
          const totalItems = Number(res.headers.get('X-Total-Count'));
          if (this.dateReqIOC.fromDate === 0 && this.dateReqIOC.toDate === 0) {
            this.auditDownloadShowHide = true;
          } else {
            this.auditDownloadShowHide = false;
          }
          this.dcs.setTotalRecords(totalItems, res.body.length, this.pagerInfo.pageSize);
          this.searchAcessLogsList = res.body;
          this.dcs.setAjexStatus(false);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }, 200);
  }

  resetAllLogs() {
    this.dateReqIOC.fromDate = 0;
    this.dateReqIOC.toDate = 0;
    this.fromDate = null;
    this.toDate = null;
    this.queryAccessLog();
  }

  resetAll() {
    this.assetName = '';
    this.action = '';
    const data = {
      index: 2,
    };
    this.onAuditTabChange(data);
  }

  downloadAccessLogs() {
    if (!this.dateReqIOC.fromDate) {
      this.dateReqIOC.fromDate = 0;
    }
    if (!this.dateReqIOC.toDate) {
      this.dateReqIOC.toDate = 0;
    }
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.downloadAccessLog(this.orgId, this.dateReqIOC).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'acess-logs.csv');
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  orgAssetCsvDownload() {
    const monitor = 0;
    this.dcs.setAjexStatus(true);
    if (!this.searchAssets) {
      this.searchAssets = '';
    }
    this.orgAssetsService.orgAssetCsvDownload(this.orgBasicDetails.id, monitor, this.searchAssets).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'org-assets.csv');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  showUrlFields(e: { checked: boolean }) {
    this.isUrlFields = e.checked;
  }
  importUrl() {
    const req = {
      // 'url': this.extUrl,
      url: this.orgBasicDetails.website,
      complexity: 'high',
      size: 25,
      save: true,
      orgId: this.orgBasicDetails.id,
    };
    if (req.url) {
      const alertDialogRef = this.dialog.open(MatDialogComponent, {
        width: '300px',
        height: '270px',
        disableClose: true,
        data: { action: 'API_ALERT', message: 'Do you want to import the attributes from ' + req.url + ' website?' },
      });
      alertDialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.dcs.setAjexStatus(true);
          this.orgDetailsService.getUrlDetails(req).subscribe(
            res => {
              this.dcs.setAjexStatus(false);
              alert('Get informations successfully');
            },
            (res: HttpErrorResponse) => this.onError(res.message)
          );
        }
      });
    } else {
      this.snackbar.open('Org website detail was not available. Please update the website detail and try again', '', {
        duration: 4000,
      });
    }
  }

  // Org subscri module func. statrs
  addSubscription() {
    const reqObj: any = {
      orgId: this.orgBasicDetails.id,
      moduleName: [],
    };
    this.modules.map(_module => {
      if (_module.subscribed && !_module.active) {
        reqObj.moduleName.push(_module.moduleName);
      }
    });
    this.dcs.setAjexStatus(true);
    this.orgSubscriptionService.create(reqObj).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        reqObj.moduleName = [];
        this.dcs.setApiStatus({ status: 'success', action: 'Subscriptions' });
        if (res.body!.response === 'error') {
          this.dialog.open(MatDialogComponent, {
            width: '300px',
            height: '270px',
            disableClose: false,
            data: { action: 'API_ERROR', message: res.body!.message },
          });
        } else {
          this.dialog.open(MatDialogComponent, {
            width: '300px',
            height: '270px',
            disableClose: false,
            data: { action: 'API_SUCCESS', message: 'Modules Subscribed' },
          });
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  editOrgSubsModule(_module?: any) {
    this.setSubsActions(_module.moduleName, true, false, _module.active);
    this.orgSubsForm = this.fb.group({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      noofCampaign: new FormControl('', [Validators.pattern(this.numericPattern)]),
      noofEmail: new FormControl('', [Validators.pattern(this.numericPattern)]),
      noofAnalysis: new FormControl('', [Validators.pattern(this.numericPattern)]),
      noofEvents: new FormControl('', [Validators.pattern(this.numericPattern)]),
    });
    if (_module.startDate || _module.endDate) {
      this.orgSubsForm.patchValue(
        {
          startDate: {
            year: new Date(_module.startDate).getFullYear(),
            month: new Date(_module.startDate).getUTCMonth() + 1,
            day: new Date(_module.startDate).getDate(),
          },
        },
        { onlySelf: true }
      );
      this.orgSubsForm.patchValue(
        {
          endDate: {
            year: new Date(_module.endDate).getFullYear(),
            month: new Date(_module.endDate).getUTCMonth() + 1,
            day: new Date(_module.endDate).getDate(),
          },
        },
        { onlySelf: true }
      );
    }
  }
  viewSubscribedModuleDetails(moduleInfo: any) {
    this.setSubsActions(moduleInfo.moduleName, false, true, moduleInfo.active);
    this.orgService.getModuleSubscribedDetails(this.orgId, moduleInfo.moduleName).subscribe(
      res => {
        this.selectedSubscribedModule = res.body;
      },
      err => {
        this.selectedSubscribedModule = null;
        this.onError(err);
      }
    );
  }
  newSubscription(status?: any) {
    // const orgId = this.orgBasicDetails.id;
    const reqObj: any = <OrgSubscription>this.orgSubsForm.value;
    const callObj: any = {
      id: [],
      orgId: this.orgBasicDetails.id,
      moduleName: [],
      subKey: [],
      status,
    };
    if (this.subscriptionActions.selectedModule === 'Cyber Incident Analytics') {
      callObj.moduleName.push('Cyber Incident Analytics');
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
    } else if (this.subscriptionActions.selectedModule === 'Threat Visibility and Intelligence') {
      callObj.moduleName.push('Threat Visibility and Intelligence');
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
    } else if (this.subscriptionActions.selectedModule === 'Cyber Situational Awareness') {
      callObj.moduleName.push('Cyber Situational Awareness');
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
    } else if (this.subscriptionActions.selectedModule === 'Cyber Education') {
      callObj.moduleName.push(this.subscriptionActions.selectedModule);
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
      if (reqObj.noofCampaign) {
        callObj.subKey.push('No of Campaigns|' + reqObj.noofCampaign);
      }
      if (reqObj.noofEmail) {
        callObj.subKey.push('No of Emails|' + reqObj.noofEmail);
      }
    } else if (this.subscriptionActions.selectedModule === 'Cyber Vulnerability Analytics') {
      callObj.moduleName.push(this.subscriptionActions.selectedModule);
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
      if (reqObj.noofAnalysis) {
        callObj.subKey.push('No of Analysis|' + reqObj.noofAnalysis);
      }
    } else if (
      this.subscriptionActions.selectedModule === 'Cyber Risk Scoring' ||
      this.subscriptionActions.selectedModule === 'Brand/Individual Cyber Risk Monitoring'
    ) {
      callObj.moduleName.push(this.subscriptionActions.selectedModule);
      callObj.startDate = this.convertDate(reqObj.startDate);
      callObj.endDate = this.convertDate(reqObj.endDate);
      if (reqObj.noofEvents) {
        callObj.subKey.push('No of Events|' + reqObj.noofEvents);
      }
    }
    this.dcs.setAjexStatus(true);
    this.orgSubscriptionService.subscribeModule(callObj).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.dcs.setApiStatus({ status: 'success', action: 'Subscriptions' });
        if (res.body!.response === 'error') {
          this.dialog.open(MatDialogComponent, {
            width: '300px',
            height: '270px',
            disableClose: false,
            data: { action: 'API_ERROR', message: res.body!.message },
          });
        } else {
          this.dialog.open(MatDialogComponent, {
            width: '300px',
            height: '270px',
            disableClose: false,
            data: { action: 'API_SUCCESS', message: res.body!.message },
          });
          this.setSubsActions('', false, false, false);
          // this.switchNavigatedOrg('Subscriptions');
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  // check organisation is nither root org nor analyst.
  checkSubscriptionEditAuthentication(): boolean {
    const isAnalyst = this.dcs.checkAnalyst();
    const isRootOrg = this.dcs.checkRootOrg();
    if (isAnalyst && isRootOrg) {
      return true;
    } else {
      return false;
    }
  }
  resetOrgSubsForm(): void {
    // this.setSubsActions('', false, false);
    this.orgSubsForm = this.fb.group({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      noofCampaign: new FormControl(''),
      noofEmail: new FormControl(''),
      noofAnalysis: new FormControl(''),
      noofEvents: new FormControl(''),
    });
  }

  // check if module belongs to basic package module.
  isBasicPackage(module: any): boolean {
    if (typeof module === 'string') {
      return this.basicModules.indexOf(module) === -1 ? true : false;
    } else {
      return this.basicModules.indexOf(module.moduleName) === -1 ? true : false;
    }
  }
  // set, reset subscription action
  setSubsActions(...subs: (string | boolean)[]) {
    this.subscriptionActions.selectedModule = subs[0];
    this.subscriptionActions.edit = subs[1];
    this.subscriptionActions.view = subs[2];
    this.subscriptionActions.moduleActive = subs[3];
  }
  noneSelected() {
    return !this.modules.some(module => module.subscribed);
  }

  getHost() {
    return window.location.href.split('#')[0];
  }
  private convertDate(reqObj: string) {
    reqObj = this.dateUtils.convertLocalDateToServer(reqObj);
    return reqObj;
  }

  requestReset(email: string) {
    this.passwordResetInitService.save(email).subscribe((res: any) => {
      if (res.status === 'success') {
        this.dialog.open(MatDialogComponent, {
          width: '300px',
          height: '270px',
          disableClose: false,
          data: { action: 'API_SUCCESS', message: res.message },
        });
      } else {
        this.dialog.open(MatDialogComponent, {
          width: '300px',
          height: '270px',
          disableClose: false,
          data: { action: 'API_SUCCESS', message: res.message },
        });
      }
    });
  }

  validate(label?: string): any {
    if (!this.files) {
      alert('Please select the file to validate.');
      return false;
    } else {
      if (label && label === 'DRD-keywords') {
        const formData = new FormData();
        formData.append('file', this.files);
        this.dcs.setAjexStatus(true);
        this.orgDetailsService.validateDRDDomainKeywordCsv(formData).subscribe(
          (response: HttpResponse<any>) => {
            this.dcs.setAjexStatus(false);
            this.fileStatus = 'Select File';
            this.files = new File([''], '');
            alert(response.body.message.replace(/~/g, '\n'));
            // this.snackBar.open(response.body.message.replaceAll(/~/g, '\n'), '', {
            //      duration: 3000
            // });
            this.files = null;
            this.fileStatus = 'Select File';
            this.dcs.setApiStatus({ status: 'success', action: 'Assets' });
          },
          (response: HttpErrorResponse) => this.onError(response.message)
        );
      } else {
        const formData = new FormData();
        formData.append('file', this.files);
        this.dcs.setAjexStatus(true);
        this.orgAssetsService.validateCsv(formData).subscribe(
          (response: HttpResponse<any>) => {
            this.dcs.setAjexStatus(false);
            this.fileStatus = 'Select File';
            this.files = new File([''], '');
            alert(response.body.message.replace(/~/g, '\n'));
            // this.snackBar.open(response.body.message.replaceAll(/~/g, '\n'), '', {
            //      duration: 3000
            // });
            this.files = null;
            this.fileStatus = 'Select File';
            // this.dcs.setApiStatus({ status: 'success', action: 'Assets' });
          },
          (response: HttpErrorResponse) => this.onError(response.message)
        );
      }
    }
  }

  deleteAllDigitalRisks() {
    const alertDialogRef = this.dialog.open(MatDialogComponent, {
      width: '400px',
      height: '370px',
      disableClose: true,
      data: {
        action: 'API_ALERT',
        message:
          'The keywords will be deleted immediately, The data discoverd for these keywords will be deleted with in 24 hours.<br><br><br> Are you sure you want to delete?',
      },
    });
    alertDialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.monitor = 1;
        this.orgAssetsService.deleteAll(this.monitor, this.orgId, this.digitalRiskIds).subscribe(
          resp => {
            this.dcs.setAjexStatus(false);
            this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Keywords' });
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
            });
            this.checkedAllDigitalRisk = false;
            this.digitalRiskIds = [];
            this.clickAllDigitalRisk = false;
          },
          (resp: HttpErrorResponse) => this.onError(resp.message)
        );
      }
    });
  }
  changeCheckbox(data: { [x: string]: any; id: number }, event: { checked: any }) {
    this.clickAllDigitalRisk = false;
    if (event.checked) {
      this.digitalRiskIds.push(data.id);
    } else {
      const index: number = this.digitalRiskIds.indexOf(data.id);
      this.digitalRiskIds.splice(index, 1);
    }
    if (this.digitalRiskIds.length > 0) {
      this.digitalRiskDelete = true;
    } else {
      this.digitalRiskDelete = false;
    }
    if (this.dataBreachAssetsList.length === this.digitalRiskIds.length) {
      this.clickAllDigitalRisk = true;
    }
    data['checkbox'] = event.checked;
  }
  selectAllCheckbox(event: { checked: any }) {
    this.digitalRiskIds = [];
    this.dataBreachAssetsList = this.dataBreachAssetsList.map(e => {
      if (event.checked) {
        this.digitalRiskIds.push(e.id);
      }
      e['checkbox'] = event.checked;
      return e;
    });
    if (event.checked) {
      this.digitalRiskDelete = true;
    } else {
      this.digitalRiskDelete = false;
    }
  }
  changeTempCheckbox(data: { [x: string]: any; id: any }, event: { checked: any }) {
    this.clickAllDigitalRiskTemp = false;
    if (event.checked) {
      this.digitalRiskTempIds.push({ id: data.id });
    } else {
      this.digitalRiskTempIds = this.digitalRiskTempIds.filter(item => item.id !== data.id);
    }
    if (this.digitalRiskTempIds.length > 0) {
      this.digitalRiskTempDelete = true;
    } else {
      this.digitalRiskTempDelete = false;
    }
    if (this.dataBreachAssetsTempList.length === this.digitalRiskTempIds.length) {
      this.clickAllDigitalRiskTemp = true;
    }
    data['checkbox'] = event.checked;
  }
  selectAllTempCheckbox(event: { checked: any }) {
    this.digitalRiskTempIds = [];
    this.dataBreachAssetsTempList = this.dataBreachAssetsTempList.map(e => {
      if (event.checked) {
        this.digitalRiskTempIds.push({ id: e.id });
      }
      e['checkbox'] = event.checked;
      return e;
    });
    if (event.checked) {
      this.digitalRiskTempDelete = true;
    } else {
      this.digitalRiskTempDelete = false;
    }
  }
  copyAllTempDigitalRisks() {
    const alertDialogRef = this.dialog.open(MatDialogComponent, {
      width: '400px',
      height: '370px',
      disableClose: true,
      data: {
        action: 'API_ALERT',
        message: 'The keywords will be copied to Digital Risk Keyword.<br><br><br> Are you sure you want to copy selected keywords?',
      },
    });
    alertDialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.dcs.setAjexStatus(true);
        this.orgAssetsTempService.copy(this.digitalRiskTempIds).subscribe(
          resp => {
            this.dcs.setAjexStatus(false);
            this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Keywords (Temp)' });
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_SUCCESS', message: 'Copied Successfully' },
            });
            this.checkedAllTempDigitalRisk = false;
            this.digitalRiskTempIds = [];
            this.clickAllDigitalRiskTemp = false;
          },
          (resp: HttpErrorResponse) => this.onError(resp.message)
        );
      }
    });
  }
  deleteAllTempDigitalRisks() {
    const alertDialogRef = this.dialog.open(MatDialogComponent, {
      width: '400px',
      height: '370px',
      disableClose: true,
      data: {
        action: 'API_ALERT',
        message: 'Are you sure you want to delete?',
      },
    });
    alertDialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.dcs.setAjexStatus(true);
        this.orgAssetsTempService.delete(this.digitalRiskTempIds).subscribe(
          resp => {
            this.dcs.setAjexStatus(false);
            this.dcs.setApiStatus({ status: 'success', action: 'Digital Risk Keywords (Temp)' });
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_SUCCESS', message: 'Deleted Successfully' },
            });
            this.checkedAllTempDigitalRisk = false;
            this.digitalRiskTempIds = [];
            this.clickAllDigitalRiskTemp = false;
          },
          (resp: HttpErrorResponse) => this.onError(resp.message)
        );
      }
    });
  }
  removeDRTemp(id: any) {
    this.digitalRiskTempIds = [{ id }];
    if (this.dataBreachAssetsTempList.length === this.digitalRiskTempIds.length) {
      this.clickAllDigitalRiskTemp = true;
    }
    this.deleteAllTempDigitalRisks();
  }
  isAssetChecked(asset: any) {
    return this.digitalRiskTempIds.findIndex(item => item.id === asset.id) > -1;
  }
  selectAllDigitalRisks(event?: any, status?: string, ids?: any) {
    this.checkedAllDigitalRisk = false;
    this.clickAllDigitalRisk = event.checked;
    if (status === 'All') {
      if (!ids) {
        // this.digitalRiskIds = [];
        this.digitalRiskIds = this.dataBreachAssetsList.map(x => x.id);
      }
      if (event.checked === true) {
        this.digitalRiskDelete = true;
        this.checkedAllDigitalRisk = true;
      } else if (event.checked === false) {
        this.digitalRiskDelete = false;
        this.checkedAllDigitalRisk = false;
        this.digitalRiskIds = [];
      }
    } else if (status === 'One') {
      this.digitalRiskDelete = true;
      this.clickAllDigitalRisk = false;
      const index: number = this.digitalRiskIds.indexOf(ids);
      if (event.checked === true && index === -1) {
        this.digitalRiskIds.push(ids);
      } else if (event.checked === false) {
        if (index !== -1) {
          this.digitalRiskIds.splice(index, 1);
        }
        if (this.digitalRiskIds.length > 0) {
          this.digitalRiskDelete = true;
        } else {
          this.digitalRiskDelete = false;
        }
      }
    }
  }

  // org subscription module func. ends
  resetPageInfo(): void {
    this.dcs.setTotalRecords(0, 0, 0);
    this.pagerInfo = {
      currentPage: 1,
      pageSize: 20,
      sort: ['id,DESC'],
    };
  }

  auditTabChange(e: any) {
    this.resetPageInfo();
    const event = {
      index: e.index,
    };
    this.onAuditTabChange(event);
  }

  // switch audit tab
  onAuditTabChange(e: any) {
    const req: any = {
      page: this.pagerInfo.currentPage - 1,
      size: this.pagerInfo.pageSize,
      sort: ['id,DESC'],
    };
    this.selectedAuditIndex = e.index;
    // call for org-audit
    if (e.index === 0) {
      this.orgService.orgAuditList(this.orgId, req).subscribe(
        (res: HttpResponse<OrgAudit[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgAuditList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    // call for user-audit
    if (e.index === 1) {
      this.orgService.orgUserAuditList(this.orgId, req).subscribe(
        (res: HttpResponse<OrgUserAudit[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgUserAuditList = res.body!;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (e.index !== 2) {
      this.action = '';
      this.assetmonitor = 0;
      this.assetName = '';
    }
    if (e.index === 2) {
      const searchBy: any = {
        assetName: this.assetName ? this.assetName : '',
        action: this.action ? this.action : '',
        monitor: this.assetmonitor ? this.assetmonitor : 0,
      };
      this.orgAssetsService.searchqueryAssetAudit(this.orgId, req, searchBy).subscribe(
        (res: HttpResponse<OrgAssetsAudit[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgAssetAuditList = res.body!;
          for (let i = 0; i < this.orgAssetAuditList.length; i++) {
            if (this.orgAssetAuditList[i].action === 'ORG_ASSETS_CREATE') {
              this.orgAssetAuditList[i].action = 'CREATE';
            } else if (this.orgAssetAuditList[i].action === 'ORG_ASSETS_UPDATE') {
              this.orgAssetAuditList[i].action = 'UPDATE';
            } else {
              this.orgAssetAuditList[i].action = 'ORG_ASSETS_DELETE';
            }
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (e.index === 3) {
      // let pagerReq: PageReq;
      const pagerReq: PageReq = {
        page: this.pagerInfo.currentPage - 1,
        size: this.pagerInfo.pageSize,
      };
      if (!this.dateReqIOC.fromDate) {
        this.dateReqIOC.fromDate = 0;
      }
      if (!this.dateReqIOC.toDate) {
        this.dateReqIOC.toDate = 0;
      }
      this.dcs.setAjexStatus(true);
      this.orgAssetsService.queryAccessLog(pagerReq, this.orgId, this.dateReqIOC).subscribe(
        (res: HttpResponse<any>) => {
          const totalItems: any = res.headers.get('X-Total-Count');
          if (this.dateReqIOC.fromDate === 0 && this.dateReqIOC.toDate === 0) {
            this.auditDownloadShowHide = true;
          } else {
            this.auditDownloadShowHide = false;
          }
          this.dcs.setTotalRecords(totalItems, res.body.length, this.pagerInfo.pageSize);
          this.searchAcessLogsList = res.body;
          this.dcs.setAjexStatus(false);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (e.index === 4) {
      const searchBy: any = {
        action: this.action ? this.action : '',
      };
      this.OrgSubscriptionAuditService.searchquerySubscriptionAudit(this.orgId, req, searchBy).subscribe(
        (res: HttpResponse<OrgSubscriptionAudit[]>) => {
          this.dcs.setAjexStatus(false);
          const totalItems: any = res.headers.get('X-Total-Count');
          this.dcs.setTotalRecords(totalItems, res.body!.length, this.pagerInfo.pageSize);
          this.orgSubscriptionList = res.body!;
          for (let i = 0; i < this.orgSubscriptionList.length; i++) {
            if (this.orgSubscriptionList[i].action === 'CREATE') {
              this.orgSubscriptionList[i].action = 'CREATE';
            } else if (this.orgSubscriptionList[i].action === 'UPDATE') {
              this.orgSubscriptionList[i].action = 'UPDATE';
            }
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }
  // check for root org, analyst, admin
  isAccessiable(data: any): boolean {
    return data ? (data.roleType === 'Analyst' || data.roleType === 'Admin' || this.isRootOrg ? true : false) : false;
  }
  // load on config sub tab changed
  onConfigTabChange(event: any) {
    this.selectedConfigIndex = event.index;
    if (event.index === 0) {
      // get config api to map config
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
  }
  filterFeedsTypes(type: string) {
    this.dcs.setAjexStatus(true);
    const search = type === 'source' ? this.searchClientSource : this.clientFeedsType;
    this.feedService.searchClientSource(type, search).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.clientsFeeds = res.body!;
      },
      err => this.onError(err)
    );
  }

  // goToStixVuln() {
  //   if (!this.searchCveStix) {
  //     this.searchCveStix = '';
  //   }
  //   this.stixVulnerbilityJson21Url = this.getHost() + `core/api-ua/vulnerability/stix/v2.1?key=` + this.orgBasicDetails.apiKey + `&cve=` + this.searchCveStix;
  //   window.open(this.stixVulnerbilityJson21Url);
  // }

  // goToStixThreatActor() {
  //   if (!this.searchThreatActor) {
  //     this.searchThreatActor = '';
  //   }
  //   this.sitxThreatActorJson21Url = this.getHost() + `core/api-ua/threatactor/stix/v2.1-json?key=` + this.orgBasicDetails.apiKey + `&name=` + this.searchThreatActor;
  //   window.open(this.sitxThreatActorJson21Url);
  // }
  // goToStixThreatIOC() {
  //   if(!this.searchIndicatorType && this.searchValue){
  //     this.searchValue ='';
  //     this.searchIndicatorType = '';
  //   }
  // tslint:disable-next-line:max-line-length
  //   this.sitxThreatIOCRelationJson21Url = this.getHost() + `core/api-ua/threatioc/stix/relation/v2.1-json?key=` + this.orgBasicDetails.apiKey + `&indicatorType=` + this.searchIndicatorType + `&value=` + this.searchValue;
  //   window.open(this.sitxThreatIOCRelationJson21Url);
  // }
  // new layout methods
  switchMainTabView(tab: any, index?: any) {
    if (!this.sot || this.sot !== tab) {
      this.pagerInfo.currentPage = 1;
      this.dcs.setTotalRecords(0, 0, 0);
    }
    this.sot = tab;
    this.activeNavigatorNav = tab;
    if (index !== null) {
      this.highliteTab(index);
    }
    this.switchNavigatedOrg(this.sot);
  }
  highliteTab(currentNavIndex: number) {
    // this.sot = nav.name;
    this.sci = currentNavIndex;
    let i = 1;
    for (i = 1; i < this.orgTopNav.length; i++) {
      if (currentNavIndex >= i) {
        this.orgTopNav[i].ac = true;
      } else {
        this.orgTopNav[i].ac = false;
      }
    }
  }
  // switch keywods tab for selected domain.
  addKeywordsToDomain(drdDomain: any) {
    this.selectedDomain = { domain: drdDomain.domain, id: drdDomain.id };
    this.sot = 'Domain Keywords';
    this.switchNavigatedOrg(this.sot);
  }
  searchByDomain() {
    const searchBy: any = {};
    searchBy.domain = this.searchDomain;
    this.orgId = parseInt(this.params.id, 10);
    this.dcs.setAjexStatus(true);
    this.orgDetailsService.searchDRDDomain(this.orgId, searchBy).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.drdDomains = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  searchByCompany() {
    const searchBy: any = {};
    searchBy.company = this.searchCompany;
    this.orgId = parseInt(this.params.id, 10);
    this.dcs.setAjexStatus(true);
    this.orgDetailsService.searchDRDCompany(this.orgId, searchBy).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.drdCompany = res.body!;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  // get third party domain list
  getTPD() {
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.getThirdPartyDomain(this.orgId).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dcs.setAjexStatus(false);
        this.tpdList = res.body!;
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }
  deleteTPD(id: number) {
    this.orgAssetsService.deleteThirdPartyDomain(id).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dcs.setAjexStatus(false);
        this.dataService.showApiStatus({ action: 'API_SUCCESS', message: 'Successfully Deleted.' });
        this.getTPD();
      },
      (error: HttpErrorResponse) => {
        this.dataService.showApiStatus({ action: 'API_ERROR', message: error.message });
        this.onError(error);
      }
    );
  }
  setAddress(address: string, city: string, state: string, country: string, zip: string): string {
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

  convertTZ(date: string | number | Date, tzString: any): string {
    if (date && tzString) {
      const datepipe = new DatePipe('en-US');
      const value = datepipe.transform(date, 'yyyy/MM/dd hh:mm:ss +0000');
      const dateString: Date = new Date(
        (typeof value === 'string' ? new Date(value) : value)!.toLocaleString('en-US', { timeZone: tzString })
      );
      return dateString.toString();
    } else {
      return '';
    }
  }

  goBack() {
    this.router.navigate(['/cap/org']);
  }
  goPrevPage() {
    if (this.defaultRoute) {
      this.goBack();
    } else {
      this.location.back();
    }
  }
  private onError(error: string | HttpErrorResponse) {
    this.dcs.setAjexStatus(false);
  }
  iocsStixXML() {
    this.iocsStixXMLShowHide ? (this.iocsStixXMLShowHide = false) : (this.iocsStixXMLShowHide = true);
  }
  iocsStixJSON() {
    this.iocsStixJSONShowHide ? (this.iocsStixJSONShowHide = false) : (this.iocsStixJSONShowHide = true);
  }
  iocsStix2xJSON() {
    this.iocsStix2xJSONShowHide ? (this.iocsStix2xJSONShowHide = false) : (this.iocsStix2xJSONShowHide = true);
  }
  threatActorStix1xJSON() {
    this.threatActorStix1xJSONShowHide ? (this.threatActorStix1xJSONShowHide = false) : (this.threatActorStix1xJSONShowHide = true);
  }
  threatActorStix2xJSON() {
    this.threatActorStix2xJSONShowHide ? (this.threatActorStix2xJSONShowHide = false) : (this.threatActorStix2xJSONShowHide = true);
  }
  VulnerabilityStix1xJSON() {
    this.VulnerabilityStix1xJSONShowHide ? (this.VulnerabilityStix1xJSONShowHide = false) : (this.VulnerabilityStix1xJSONShowHide = true);
  }
  VulnerabilityStix2xJSON() {
    this.VulnerabilityStix2xJSONShowHide ? (this.VulnerabilityStix2xJSONShowHide = false) : (this.VulnerabilityStix2xJSONShowHide = true);
  }
  alertsstxjson() {
    this.alertsstxjsonShowHide ? (this.alertsstxjsonShowHide = false) : (this.alertsstxjsonShowHide = true);
  }
  // alert-config create
  private createForm(): void {
    this.alertConfigForm = this.fb.group({
      attackSurface: this.fb.group({
        // 'isVulnerable': [false],
        // 'isOpenPorts': [false],
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      certificates: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
        // 'isExpired': [false],
        // 'isExpiring': [false],
        // 'isWeak': [false],
        // 'isVulnerable': [false]
      }),
      impersonation: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      brandInfringement: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      vulnerability: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
        isVersionOnly: [false],
        isVendor: [false],
        isAsset: [false],
      }),
      dataLeak: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      ipWithVulnerability: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      phishing: this.fb.group({
        isAnyDomainMatch: [false],
      }),
      impersonationAndInfringement: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      socialAndPublicExposure: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      dataBreachAndWebMonitoring: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      configurations: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      openPorts: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      ipDomainReputation: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      cloudWeakness: this.fb.group({
        isCritical: [false],
        isHigh: [false],
        isMedium: [false],
        isLow: [false],
      }),
      email: this.fb.group({
        email: [false],
      }),
      consolidated: this.fb.group({
        consolidated: [false],
      }),
    });
    this.sendEmailForm = this.fb.group({
      emailIds: ['', [Validators.required, this.commaSepEmail]],
    });
  }
  // get subscribed package details by client
  getActivePackage(orgId: number) {
    this.orgSubscriptionService.getActivePackageDetails(orgId).subscribe(
      (res: HttpResponse<any>) => {
        this.activePackage = res.body;
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }
  // upgrade/subscribe account
  upgradeAccount() {
    const _qp: any = {
      active: this.activePackage.name,
    };
    const sa = this.getAddons(); // selected addon to upgrade.
    if (sa?.length) {
      _qp['addon'] = this.getAddonNames(sa);
    }
    this.router.navigate(['subscribe/packages', this.orgId], { queryParams: _qp });
  }
  getAddons(): any[] {
    return this.activePackage.featuresDTO
      ? this.activePackage.featuresDTO.filter((_addon: any) => _addon.type === 'Addon' && _addon.status === 'Active')
      : [];
  }
  getAddonNames(addons: any[]): string {
    if (addons?.length) {
      const addonNames: any[] = [];
      addons.map((_addon: any) => {
        addonNames.push(_addon.name);
      });
      return addonNames.join(',');
    } else {
      return '';
    }
  }
  getPackageColor(colorType: string) {
    if (!colorType) {
      return this.packageColors['default'];
    }
    return this.packageColors[colorType.toLowerCase()];
  }
  upgradeAccess(refStatus: string): boolean {
    if (!refStatus || refStatus.toLowerCase() !== 'aws') {
      return true;
    } else {
      return false;
    }
  }
  // activate nav keys
  updateOrgTopNav(activeKeys: string[]) {
    if (activeKeys.length) {
      this.orgTopNav.forEach(_navItem => {
        if (activeKeys.indexOf(_navItem.id) > -1) {
          _navItem.active = true;
        } else {
          _navItem.active = false;
        }
      });
    }
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.navigatorSubscription.unsubscribe();
    this.pagerSubscription.unsubscribe();
    this.apiStatusSubscription.unsubscribe();
  }
  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(',');
    const forbidden = emails.some((email: any) => Validators.email(new FormControl(email)));
    return forbidden ? { emailIds: { value: control.value } } : null;
  };
  changedBcc(form: { controls: { [x: string]: { value: string } } }) {
    const emails = form.controls['bcc'].value.split(',');
    const forbidden = emails.some((email: any) => Validators.email(new FormControl(email)));
    if (forbidden) {
      this.isBccValid = true;
      // this.bcc=form.controls['bcc'].value;
    } else {
      this.isBccValid = false;
    }
  }

  exportUserToCSV() {
    if (this.orgUsersCount.orgUser.length === 0) {
      this.dialog.open(MatDialogComponent, {
        width: '300px',
        height: '270px',
        disableClose: false,
        data: { action: 'API_ERROR', message: 'No user found.' },
      });
      return;
    }
    this.generateAndDownloadCSV(this.orgUsersCount.orgUser, ['firstname', 'lastname', 'email', 'phone', 'role', 'address']);
  }

  generateAndDownloadCSV(data: any, columns: any) {
    const csvData = this.ConvertToCSV(data, columns);
    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

    // if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', `${data[0].org.name}-Users.csv`);
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: string, headerList: string | any[]) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No, ';
    for (let i = 0; i < headerList.length; i++) {
      row += headerList[i].toUpperCase() + ', ';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let j = 0; j < headerList.length; j++) {
        const head = headerList[j];
        if (head === 'role') {
          if (array[i]['role']['name'] != null) {
            line += ', ' + array[i]['role']['name'].replaceAll('\n', ' ').replaceAll(',', ' ');
          } else {
            line += ', ';
          }
        } else if (head === 'address') {
          if (array[i]['org']['country'] != null) {
            line += ', ' + array[i]['org']['country'].replaceAll('\n', ' ').replaceAll(',', ' ');
          } else {
            line += ', ';
          }
        } else {
          const dd = array[i][head];
          if (dd != null) {
            line += ', ' + array[i][head].replaceAll('\n', ' ').replaceAll(',', ' ');
          } else {
            line += ', ';
          }
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  private _filterOrg(org: string): any[] {
    const filterValue = org.toLowerCase();
    const wordFilter = this.orgUserAnalysts.filter(option => option.analystFirstName.toLowerCase().indexOf(filterValue) === 0);
    return Array.from(new Set([...wordFilter]));
  }
  addAsAnalyst(type: string) {
    let req: any;
    if (type === 'sales') {
      const salesEmails = this.salesGroup.value.map((analyst: any) => analyst.email).join(',');
      req = {
        id: this.orgBasicDetails.id,
        salesPerson: salesEmails,
      };
    } else if (type === 'presales') {
      const presalesEmails = this.preSalesGroup.value.map((analyst: any) => analyst.email).join(',');
      req = {
        id: this.orgBasicDetails.id,
        presalesPerson: presalesEmails,
      };
    } else {
      req = this.analystsGroup.value.map((analyst: any) => {
        const tempObj = {
          orgId: this.orgBasicDetails.id,
          userId: analyst.analystId,
        };
        return tempObj;
      });
    }
    this.dcs.setAjexStatus(true);
    this.orgAnalystService.create(req, type).subscribe(
      (res: any) => {
        this.dcs.setAjexStatus(false);
        this.enableEdit[type] = false;
        // this.dcs.setApiStatus({ status: 'success', action: 'Basic Details' });
        this.basicInfo();
        this.snackbar.open(`${type} Assigned`, '', {
          duration: 4000,
        });
        if (type === 'analyst') {
          this.eventManager.broadcast({
            name: 'on-analyst-update',
            content: 'on anlalys update',
          });
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  toggleEdit(action: string, type: string) {
    if (action === 'analyst-selection') {
      this.enableEdit[type] = !this.enableEdit[type];
    }
  }
  displayAnalystFn(analyst?: any): any {
    let analystValue = '';
    if (analyst) {
      analystValue = analyst.analystFirstName;
    }
    return analyst ? analystValue : undefined;
  }

  optionClicked(event: any, analyst: any, type: string) {
    event.stopPropagation();
    this.toggleSelection({ checked: !this.isAnalystSelected(analyst, type) }, analyst, type);
  }

  toggleSelection(event: any, analyst: any, type: string) {
    if (event.checked) {
      this[type].push(analyst);
    } else {
      this[type] = this[type].filter((element: any) => element.analystId !== analyst.analystId);
    }
    if (type === 'selectedAnalystsList') {
      this.analystsGroup.setValue(this.selectedAnalystsList);
    } else if (type === 'sdSalesList') {
      this.salesGroup.setValue(this.sdSalesList);
    } else if (type === 'sdPresalesList') {
      this.preSalesGroup.setValue(this.sdPresalesList);
    }
  }

  isAnalystSelected(user: any, type: string) {
    if (type === 'selectedAnalystsList') {
      return this[type].some(e => e.analystId === user.analystId);
    } else {
      return this[type].some((e: { salesId: any }) => e.salesId === user.analystId);
    }
  }

  // Update orgAsset with vendor and product names from clicked suggestion object
  applySuggestion(orgAsset?: any, suggestion?: any) {
    orgAsset.vendor = suggestion.vendor;
    orgAsset.assetname = suggestion.product;
    orgAsset.cpematch = true;
    orgAsset.suggestions = [];
    this.dcs.setAjexStatus(true);
    this.orgAssetsService.update(orgAsset).subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        this.dcs.setApiStatus({ status: 'success', action: 'Assets' });
      },
      err => this.onError(err)
    );
  }

  downloadApiDoc() {
    this.dcs.setAjexStatus(true);
    this.orgService.downloadApiDocPDF().subscribe(
      res => {
        this.dcs.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'CYFIRMA_DeCYFIR_API_DOC_v0.4.pdf');
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  copyToClipboard(text: string) {
    this.dataService.copyToClipboard(text);
  }
}

interface PageReq {
  page: number;
  size: number;
}
