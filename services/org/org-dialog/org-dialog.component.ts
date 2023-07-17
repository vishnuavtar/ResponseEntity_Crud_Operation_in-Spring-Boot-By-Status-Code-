/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Component, OnInit, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { of, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, finalize } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { JhiDateUtils } from 'ng-jhipster';
import { OrgReportRecipient, OrgReportFrequency, Org, OrgReportConfig, WFN } from '../models';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialogComponent } from '../../shared/components';
import { DataService, User, UserService, DataCommunicationService } from '../../shared';
import { OrgService } from '../org.service';
import { OrgDetails, OrgUser, OrgAssets, Role } from '../models';
import {
  OrgDetailsService,
  OrgAssetsService,
  OrgUserService,
  RoleService,
  OrgReportRecipientService,
  OrgReportConfigService,
} from '../org-details-service';
import { ReportTypes } from '../../reports/file-report/models';
import { ReportTypesService } from '../../reports/file-report/services';
import { SubCategory, SubType } from '../../reports/html-report/models';
import { SubCategoryService, SubTypeService } from '../../reports/html-report/services';
import { SaDashboardService } from '../../situational/services';
import { saveAs } from 'file-saver';
import { DigitalRiskApiResultsService } from '../../core/services';
import $ from 'jquery';

@Component({
  selector: 'jhi-org-dialog',
  templateUrl: './org-dialog.component.html',
  styleUrls: ['./org-dialog.scss'],
})
export class OrgDialogComponent implements OnInit {
  // @ViewChild("TrialElement") trialRef: any;
  // @ViewChild("PaidElement") paidRef: any;
  @ViewChild('cpe')
  cpe!: ElementRef;
  @ViewChild('vendor')
  vendor!: ElementRef;
  @ViewChild('assetName')
  assetName!: ElementRef;
  @ViewChild('assetVersion')
  assetVersion!: ElementRef;
  s3BaseImgUrl: string;
  newOrgForm!: FormGroup;
  newOrgDetailsForm!: FormGroup;
  newOrgUserForm!: FormGroup;
  newOrgAssetsForm!: FormGroup;
  setupReportForm!: FormGroup;
  setupReportConfigForm!: FormGroup;
  dataBreachAssetsForm!: FormGroup;
  clientFeedsForm!: FormGroup;
  drdDomainForm!: FormGroup;
  drdCompanyForm!: FormGroup;
  drdDomainKeywordsForm!: FormGroup;
  drdDomainKeywordsCheckForm!: FormGroup;
  tpdForm!: FormGroup;
  loggedinUserDet: any = {};
  timeObj = {};
  reportStatus: any;
  frequencyDetails: any = '';
  dayDetails: any = '';
  parentOrgId!: number;
  createOrg: any = {};
  roles!: Role[];
  reportTypes!: ReportTypes[];
  subCategory!: SubCategory[];
  subType!: SubType[];
  orgs!: any[];
  industryList!: any[];
  technologyList!: any[];
  geographyList!: any[];
  orgKeys: string[] = ['Technology', 'Geography', 'Industry']; // , 'People'
  orgModules: any[] = [
    { label: 'Threat Visibility and Intelligence', active: true },
    { label: 'Cyber Incident Analytics', active: true },
    { label: 'Cyber Situational Awareness', active: true },
    { label: 'Cyber Education', active: true },
  ];
  timeZones!: any[];
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,10}$';
  numericPattern = '^[0-9]+$';
  // contactNumberPattern = '^[0-9(#+)-\\s]+$';
  contactNumberPattern = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\\s]{0,1}[-()\\s0-9]*$';
  // tslint:disable-next-line:max-line-length
  urlPattern =
    '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})';
  domainPattern = '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:.[a-zA-Z]{2,})+$';
  reportTypeStatus!: boolean;
  dataBreachAssetTypes!: string[];
  isRootOrg: any;
  is2fa!: boolean;
  validateIpAddress!: boolean;
  gitFilterInfo: any = {};
  selectedGITOption: any = {};
  industriesOptions!: any[];
  technologiesOptions!: any[];
  geographiesOptions!: any[];

  feedsTypes!: any[];
  companies!: any[];
  companyIndex!: number;
  domainKeywordsOptions: any[] = [];
  selectedOrg!: number;
  patternMatch = false;
  thirdPartyFilter = false;
  orgsNames!: any[];
  exclusionOrgList!: any[];
  orgAssetsList: any[] = ['Hardware', 'Middleware', 'Software', 'OS', 'Others'];
  digitalriskCheckDetails: any;
  minDate: any;
  maxDate: any;
  endDate: any;
  trialRef = false;
  povDropdown: any = [
    { label: 'Trial POV', value: 'TRIAL_POV' },
    { label: 'Paid POV', value: 'PAID_POV' },
  ];
  isAnalyst: boolean;
  pov!: string;
  socialHandlerIds: any = {};
  socialGroups: any[] = ['Facebook', 'Twitter', 'LinkedIn', 'YouTube']; // 'Instagram'
  tempSocial: any = { social: '', value: '' };
  tempKeys: any[] = [];
  logoUrl: String = '';
  tmpImage: any = null;
  logoUpdated: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OrgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dataCommunicationService: DataCommunicationService,
    private ds: DataService,
    private orgService: OrgService,
    private digitalriskconfigservice: DigitalRiskApiResultsService,
    private orgDetailsService: OrgDetailsService,
    private orgAssetsService: OrgAssetsService,
    private orgReportRecipientService: OrgReportRecipientService,
    private orgUserService: OrgUserService,
    private roleService: RoleService,
    private subCategoryService: SubCategoryService,
    private subTypeService: SubTypeService,
    private fileTypeService: ReportTypesService,
    private userService: UserService,
    private dateUtils: JhiDateUtils,
    private saDashboardService: SaDashboardService,
    private orgReportConfigService: OrgReportConfigService
  ) {
    const date = new Date();
    this.isAnalyst = this.dataCommunicationService.checkAnalyst();
    this.minDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    this.maxDate = { year: date.getFullYear() + 100, month: date.getMonth() + 1, day: date.getDate() };
    this.gitFilterInfo = this.dataCommunicationService.loadGitConfit();
    this.s3BaseImgUrl = this.ds.getS3BaseIconsUrl();
    if (this.data.action === 'createDataBreachAsset' || this.data.action === 'drd-domain-keywords') {
      this.dataBreachAssetTypes = [
        'Project Name',
        'File Name',
        'Department Name',
        'Domain',
        'Individuals Name',
        'Email Address',
        'IP',
        'ASN',
        'Software',
        'Source Code File Name',
        'Intellectual Property',
        'Copyright Information',
        'Twitter',
        'Facebook',
        'LinkedIn',
        'YouTube',
        'Product Name',
        'Service Name',
        'Mobile App',
        'Others',
      ];
      this.domainKeywordsOptions = this.dataBreachAssetTypes.filter(_t => _t !== 'Domain');
    }
    if (this.data.action === 'logoDialog') {
      console.log(this.data.logo);
      this.logoUrl = `data:image/png;base64,${this.data.logo}`;
    }
  }
  radioChange(type: any) {
    const date = new Date();
    if (type === 'TRIAL_POV') {
      this.orgModules.map(e => (e.label === 'Threat Visibility and Intelligence' ? (e.active = true) : (e.active = false)));
      let vals = this.newOrgForm.value.moduleName;
      vals = vals.filter((e: any) => e !== 'Cyber Incident Analytics' && e !== 'Cyber Situational Awareness');
      this.newOrgForm.patchValue({ moduleName: vals }, { onlySelf: true });
      // this.newOrgForm.controls['pov'].setValue(type);
      this.newOrgForm.controls['noOfUsers'].setValue(2);
      this.trialRef = true;
      this.maxDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() + 21 };
    } else if (type === 'PAID_POV') {
      this.orgModules.map(e => (e.active = true));
      // this.newOrgForm.controls['pov'].setValue(type);
      this.trialRef = false;
      this.newOrgForm.controls['noOfUsers'].setValue(5);
      this.maxDate = { year: date.getFullYear() + 100, month: date.getMonth() + 1, day: date.getDate() };
    } else {
      this.trialRef = false;
      this.orgModules.map(e => (e.active = true));
      this.newOrgForm.controls['noOfUsers'].setValue(5);
      this.minDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
      this.maxDate = { year: date.getFullYear() + 100, month: date.getMonth() + 1, day: date.getDate() };
    }
  }
  closeDialog(formSubmitted?: boolean): void {
    this.dialogRef.close(formSubmitted);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    if (this.data.action === 'createOrgAssets') {
      fromEvent(this.cpe.nativeElement, 'keyup')
        .pipe(
          // get value
          map((event: any) => event.target.value),
          // if character length greater then 8
          // , filter(res => res.length > 8)
          // Time in milliseconds between key events
          debounceTime(1000),
          // If previous query is diffent from current
          distinctUntilChanged()
          // call remote api
        )
        .subscribe((text: string) => {
          this.processCPE(text);
        });

      fromEvent(this.vendor.nativeElement, 'keyup')
        .pipe(
          // get value
          map((event: any) => event.target.value),
          // if character length greater then 8
          // , filter(res => res.length > 8)
          // Time in milliseconds between key events
          debounceTime(1000),
          // If previous query is diffent from current
          distinctUntilChanged()
          // call remote api
        )
        .subscribe((text: any) => {
          this.handleAssetFormDataChange(text);
        });

      fromEvent(this.assetName.nativeElement, 'keyup')
        .pipe(
          // get value
          map((event: any) => event.target.value),
          // Time in milliseconds between key events
          debounceTime(1000),
          // If previous query is diffent from current
          distinctUntilChanged()
          // call remote api
        )
        .subscribe((text: any) => {
          this.handleAssetFormDataChange(text);
        });

      fromEvent(this.assetVersion.nativeElement, 'keyup')
        .pipe(
          // get value
          map((event: any) => event.target.value),
          // Time in milliseconds between key events
          debounceTime(1000),
          // If previous query is diffent from current
          distinctUntilChanged()
          // call remote api
        )
        .subscribe((text: any) => {
          this.handleAssetFormDataChange(text);
        });
    }
  }

  ngOnInit() {
    // this.selectedOrg = this.dataCommunicationService.getChangedOrg() ? this.dataCommunicationService.getChangedOrg() : this.dataCommunicationService.getLoggedUser().orgId;
    this.loggedinUserDet = this.dataCommunicationService.getLoggedUser();
    this.selectedOrg = this.data.data?.id
      ? this.data.data.id
      : this.dataCommunicationService.getChangedOrg()
      ? this.dataCommunicationService.getChangedOrg()
      : this.dataCommunicationService.getLoggedUser().orgId;
    this.getLoggedInOrgDet(this.selectedOrg);
    this.is2fa = false;
    this.validateIpAddress = false;
    if (!!this.data.data && this.data.data.validateIpAddress) {
      this.validateIpAddress = true;
    } else {
      this.validateIpAddress = false;
    }
    this.createOrgForm();
    if (this.data.action === 'setupReports') {
      this.getFileType();
      this.getSubCategories();
      this.getSubTypes();
    }
    if (this.data.action === 'orgDetails') {
      // this.getFilterOptions();
      this.loadGITOptions(this.data.data);
    }
    if (this.data.action === 'drd-domain') {
      this.getCompanyById(this.data.orgId);
    }
    if (this.data.action === 'addClientsFeeds') {
      this.feedsTypes = this.dataCommunicationService.getFeedsTypes();
      if (this.data.data) {
        this.clientFeedsForm.patchValue({ type: this.data.data.type }, { onlySelf: true });
        this.clientFeedsForm.patchValue({ source: this.data.data.source }, { onlySelf: true });
      }
    }
    if (this.data.action === 'createOrgUser') {
      this.getRoles(this.data.orgId);
    } else {
      this.reportTypeStatus = false;
      if (this.data.data) {
        this.reportTypeStatus = true;
        setTimeout(() => {
          this.updateForm();
        }, 500);
      }
    }
    //this.domainGet();

    this.timeZones = [
      { value: 'Etc/GMT+12', name: '(GMT-12:00) International Date Line West' },
      { value: 'Pacific/Midway', name: '(GMT-11:00) Midway Island, Samoa' },
      { value: 'Pacific/Honolulu', name: '(GMT-10:00) Hawaii' },
      { value: 'US/Alaska', name: '(GMT-09:00) Alaska' },
      { value: 'America/Los_Angeles', name: '(GMT-08:00) Pacific Time (US & Canada)' },
      { value: 'America/Tijuana', name: '(GMT-08:00) Tijuana, Baja California' },
      { value: 'US/Arizona', name: '(GMT-07:00) Arizona' },
      { value: 'America/Chihuahua', name: '(GMT-07:00) Chihuahua, La Paz, Mazatlan' },
      { value: 'US/Mountain', name: '(GMT-07:00) Mountain Time (US & Canada)' },
      { value: 'America/Managua', name: '(GMT-06:00) Central America' },
      { value: 'US/Central', name: '(GMT-06:00) Central Time (US & Canada)' },
      { value: 'America/Mexico_City', name: '(GMT-06:00) Guadalajara, Mexico City, Monterrey' },
      { value: 'Canada/Saskatchewan', name: '(GMT-06:00) Saskatchewan' },
      { value: 'America/Bogota', name: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco' },
      { value: 'US/Eastern', name: '(GMT-05:00) Eastern Time (US & Canada)' },
      { value: 'US/East-Indiana', name: '(GMT-05:00) Indiana (East)' },
      { value: 'Canada/Atlantic', name: '(GMT-04:00) Atlantic Time (Canada)' },
      { value: 'America/Caracas', name: '(GMT-04:00) Caracas, La Paz' },
      { value: 'America/Manaus', name: '(GMT-04:00) Manaus' },
      { value: 'America/Santiago', name: '(GMT-04:00) Santiago' },
      { value: 'Canada/Newfoundland', name: '(GMT-03:30) Newfoundland' },
      { value: 'America/Sao_Paulo', name: '(GMT-03:00) Brasilia' },
      { value: 'America/Argentina/Buenos_Aires', name: '(GMT-03:00) Buenos Aires, Georgetown' },
      { value: 'America/Godthab', name: '(GMT-03:00) Greenland' },
      { value: 'America/Montevideo', name: '(GMT-03:00) Montevideo' },
      { value: 'America/Noronha', name: '(GMT-02:00) Mid-Atlantic' },
      { value: 'Atlantic/Cape_Verde', name: '(GMT-01:00) Cape Verde Is.' },
      { value: 'Atlantic/Azores', name: '(GMT-01:00) Azores' },
      { value: 'Africa/Casablanca', name: '(GMT+00:00) Casablanca, Monrovia, Reykjavik' },
      { value: 'Etc/Greenwich', name: '(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London' },
      { value: 'Europe/Amsterdam', name: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
      { value: 'Europe/Belgrade', name: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague' },
      { value: 'Europe/Brussels', name: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
      { value: 'Europe/Sarajevo', name: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb' },
      { value: 'Africa/Lagos', name: '(GMT+01:00) West Central Africa' },
      { value: 'Asia/Amman', name: '(GMT+02:00) Amman' },
      { value: 'Europe/Athens', name: '(GMT+02:00) Athens, Bucharest, Istanbul' },
      { value: 'Asia/Beirut', name: '(GMT+02:00) Beirut' },
      { value: 'Africa/Cairo', name: '(GMT+02:00) Cairo' },
      { value: 'Africa/Harare', name: '(GMT+02:00) Harare, Pretoria' },
      { value: 'Europe/Helsinki', name: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius' },
      { value: 'Asia/Jerusalem', name: '(GMT+02:00) Jerusalem' },
      { value: 'Europe/Minsk', name: '(GMT+02:00) Minsk' },
      { value: 'Africa/Windhoek', name: '(GMT+02:00) Windhoek' },
      { value: 'Asia/Kuwait', name: '(GMT+03:00) Kuwait, Riyadh, Baghdad' },
      { value: 'Europe/Moscow', name: '(GMT+03:00) Moscow, St. Petersburg, Volgograd' },
      { value: 'Africa/Nairobi', name: '(GMT+03:00) Nairobi' },
      { value: 'Asia/Tbilisi', name: '(GMT+03:00) Tbilisi' },
      { value: 'Asia/Tehran', name: '(GMT+03:30) Tehran' },
      { value: 'Asia/Muscat', name: '(GMT+04:00) Abu Dhabi, Muscat' },
      { value: 'Asia/Baku', name: '(GMT+04:00) Baku' },
      { value: 'Asia/Yerevan', name: '(GMT+04:00) Yerevan' },
      { value: 'Asia/Kabul', name: '(GMT+04:30) Kabul' },
      { value: 'Asia/Yekaterinburg', name: '(GMT+05:00) Yekaterinburg' },
      { value: 'Asia/Karachi', name: '(GMT+05:00) Islamabad, Karachi, Tashkent' },
      { value: 'Asia/Calcutta', name: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
      { value: 'Asia/Calcutta', name: '(GMT+05:30) Sri Jayawardenapura' },
      { value: 'Asia/Katmandu', name: '(GMT+05:45) Kathmandu' },
      { value: 'Asia/Almaty', name: '(GMT+06:00) Almaty, Novosibirsk' },
      { value: 'Asia/Dhaka', name: '(GMT+06:00) Astana, Dhaka' },
      { value: 'Asia/Rangoon', name: '(GMT+06:30) Yangon (Rangoon)' },
      { value: 'Asia/Bangkok', name: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
      { value: 'Asia/Krasnoyarsk', name: '(GMT+07:00) Krasnoyarsk' },
      { value: 'Asia/Hong_Kong', name: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
      { value: 'Asia/Kuala_Lumpur', name: '(GMT+08:00) Kuala Lumpur, Singapore' },
      { value: 'Asia/Irkutsk', name: '(GMT+08:00) Irkutsk, Ulaan Bataar' },
      { value: 'Australia/Perth', name: '(GMT+08:00) Perth' },
      { value: 'Asia/Taipei', name: '(GMT+08:00) Taipei' },
      { value: 'Asia/Tokyo', name: '(GMT+09:00) Osaka, Sapporo, Tokyo' },
      { value: 'Asia/Seoul', name: '(GMT+09:00) Seoul' },
      { value: 'Asia/Yakutsk', name: '(GMT+09:00) Yakutsk' },
      { value: 'Australia/Adelaide', name: '(GMT+09:30) Adelaide' },
      { value: 'Australia/Darwin', name: '(GMT+09:30) Darwin' },
      { value: 'Australia/Brisbane', name: '(GMT+10:00) Brisbane' },
      { value: 'Australia/Canberra', name: '(GMT+10:00) Canberra, Melbourne, Sydney' },
      { value: 'Australia/Hobart', name: '(GMT+10:00) Hobart' },
      { value: 'Pacific/Guam', name: '(GMT+10:00) Guam, Port Moresby' },
      { value: 'Asia/Vladivostok', name: '(GMT+10:00) Vladivostok' },
      { value: 'Asia/Magadan', name: '(GMT+11:00) Magadan, Solomon Is., New Caledonia' },
      { value: 'Pacific/Auckland', name: '(GMT+12:00) Auckland, Wellington' },
      { value: 'Pacific/Fiji', name: '(GMT+12:00) Fiji, Kamchatka, Marshall Is.' },
      { value: 'Pacific/Tongatapu', name: '(GMT+13:00) Nuku"alofa' },
    ];

    this.newOrgForm.patchValue(
      {
        moduleName: ['Threat Visibility and Intelligence'],
      },
      { onlySelf: true }
    );
  }

  updateSocialGroup(): void {
    if (
      this.socialGroups.indexOf('Email Address') === -1 &&
      this.data.action === 'createDataBreachAsset' &&
      this.dataBreachAssetsForm.value.assettype === 'Individuals Name'
    ) {
      this.socialGroups.push('Email Address');
    } else {
      this.socialGroups = this.socialGroups.filter((_sg: any) => _sg !== 'Email Address');
    }
  }

  getLoggedInOrgDet(id: number) {
    this.orgService.find(id).subscribe(
      (res: HttpResponse<Org>) => {
        this.isRootOrg = res.body?.rootOrg;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  domainGet() {
    this.digitalriskconfigservice.configFind(this.data.orgId).subscribe(
      res => {
        // console.log(res.body, 'resres');
        this.digitalriskCheckDetails = res.body;
      },
      err => this.onError(err)
    );
  }
  domainPost(event: any) {
    const digitalriskreq: any = {
      orgId: this.data.orgId,
      impersonation: {
        hideOrganizationDomains: this.drdDomainKeywordsCheckForm.value.domainsimilartoorganization,
      },
      brandInfringement: {},
      dataLeak: {},
      ipWithVulnerability: {},
    };

    if (this.drdDomainKeywordsCheckForm.value.domainsimilartoorganization == null) {
      digitalriskreq.impersonation.hideOrganizationDomains = this.digitalriskCheckDetails.impersonation.hideOrganizationDomains;
    }

    if (this.digitalriskCheckDetails) {
      digitalriskreq['id'] = this.digitalriskCheckDetails.id ? this.digitalriskCheckDetails.id : null;
    }

    this.digitalriskconfigservice.configCreate(digitalriskreq).subscribe(res => {
      this.closeDialog();
      this.dataCommunicationService.setAjexStatus(false);
      this.dialog.open(MatDialogComponent, {
        width: '300px',
        height: '270px',
        disableClose: false,
        data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
      });
    });
  }
  getErrorMessage(module: string): any {
    if (module === 'org') {
      if (this.newOrgForm.get('phone')?.errors && this.newOrgForm.get('phone')?.errors?.pattern) {
        this.patternMatch = true;
        return 'Contact Number must not contain any alphabets and only these special characters "-, +, (, )" are allowed. "+" is only allowed at the start and not in between';
      } else {
        this.patternMatch = false;
        return '';
      }
    } else if (module === 'orgUser') {
      if (this.newOrgUserForm.get('phone')?.errors && this.newOrgUserForm.get('phone')?.errors?.pattern) {
        this.patternMatch = true;
        return 'Contact Number must not contain any alphabets and only these special characters "-, +, (, )" are allowed. "+" is only allowed at the start and not in between';
      } else {
        this.patternMatch = false;
        return '';
      }
    }
  }

  createOrgForm() {
    if (this.data.data) {
      this.newOrgForm = this.fb.group({
        name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        aliases: [''],
        contact: [''],
        phone: new FormControl('', [Validators.maxLength(15), Validators.pattern(this.contactNumberPattern)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.pattern(this.emailPattern)]),
        address: [''],
        city: [''],
        state: [''],
        country: [''],
        zip: new FormControl(''),
        parentid: [''],
        noOfUsers: new FormControl('', [Validators.required, Validators.pattern(this.numericPattern)]),
        website: new FormControl(''),
        timeZone: [''],
        moduleName: [''],
        startDate: [''],
        endDate: [''],
        crmAccountLink: [''],
        crmOpportunityLink: [''],
        status: new FormControl(''),
        is2fa: [''],
        validateIpAddress: [''],
        securitykey: [''],
        ipValidations: [''],
        testorg: [''],
        orgType: ['Premium'],
        pov: [''],
        isThirdPartyDomainsEnable: [''],
        noOfThirdPartyDomains: [''],
        noOfDigitalRisksKeyWords: new FormControl('', [Validators.min(0), Validators.pattern(this.numericPattern)]),
      });
    } else {
      this.newOrgForm = this.fb.group({
        name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        aliases: [''],
        contact: [''],
        phone: new FormControl('', [Validators.maxLength(15), Validators.pattern(this.contactNumberPattern)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.pattern(this.emailPattern)]),
        address: [''],
        city: [''],
        state: [''],
        country: [''],
        zip: new FormControl(''),
        parentid: [''],
        noOfUsers: new FormControl('5', [Validators.required, Validators.pattern(this.numericPattern)]),
        website: new FormControl(''),
        timeZone: [''],
        status: new FormControl(''),
        moduleName: new FormControl('', [Validators.required]),
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        is2fa: [''],
        validateIpAddress: [''],
        securitykey: [''],
        ipValidations: [''],
        crmAccountLink: [''],
        crmOpportunityLink: [''],
        testorg: [''],
        orgType: ['Premium'],
        pov: [''],
        isThirdPartyDomainsEnable: [''],
        noOfThirdPartyDomains: [''],
        noOfDigitalRisksKeyWords: new FormControl('', [Validators.min(0), Validators.pattern(this.numericPattern)]),
      });
    }
    if (this.data.action === 'addClientsFeeds') {
      this.clientFeedsForm = this.fb.group({
        type: ['', Validators.required],
        source: ['', Validators.required],
      });
    } else if (this.data.action === 'drd-domain') {
      this.drdDomainForm = this.fb.group({
        name: [''],
        domain: ['', Validators.required],
        contactPerson: [''],
        email: ['', Validators.required],
        type: ['', Validators.required],
        company: [''],
      });
    } else if (this.data.action === 'drd-company') {
      this.drdCompanyForm = this.fb.group({
        name: [''],
        url: ['', Validators.required],
        contactPerson: [''],
        email: ['', Validators.required],
        address: ['', Validators.required],
        status: new FormControl(''),
      });
    } else if (this.data.action === 'drd-domain-keywords') {
      this.drdDomainKeywordsForm = this.fb.group({
        assetType: ['', Validators.required],
        assetName: [''],
        location: [],
      });
    } else if (this.data.action === 'drd-domain-keywords-check') {
      this.drdDomainKeywordsCheckForm = this.fb.group({
        domainsimilartoorganization: [],
      });
    } else if (this.data.action === 'third-party-domain') {
      this.tpdForm = this.fb.group({
        assetname: ['', [Validators.required]],
        comment: [''],
      });
    }
    this.newOrgDetailsForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
      org: [''],
    });

    this.newOrgUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.pattern(this.emailPattern)]),
      phone: new FormControl('', [Validators.maxLength(15), Validators.pattern(this.contactNumberPattern)]),
      roleOption: ['', Validators.required],
      status: new FormControl(''),
    });

    this.newOrgAssetsForm = this.fb.group({
      assettype: ['', Validators.required],
      assetname: [''],
      version: [''],
      vendor: [''],
      comments: [''],
      cpematch: [''],
      cpe: [''],
    });

    this.dataBreachAssetsForm = this.fb.group({
      assettype: ['', Validators.required],
      assetname: ['', Validators.required],
      location: [''],
    });
    this.setupReportForm = this.fb.group({
      reportType: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      defaultTime: [''],
      email: [''],
      cc: [''],
      bcc: [''],
      frequency: [''],
      day: [''],
      subject: [''],
      body: [''],
      typeOfReport: ['', Validators.required],
      subTypeId: ['', Validators.required],
      passwordProtect: [''],
      passwordMailSend: [''],
      password: [''],
    });

    this.setupReportConfigForm = this.fb.group({
      configKey: [''],
      configValue: [''],
      defaultTime: [''],
      status: [''],
      orgIds: [''],
      reportType: [''],
      emailTemplate: ['']
    });
  }

  // Process CPE change
  processCPE(cpe: any) {
    this.newOrgAssetsForm.controls['cpematch'].setValue(false);
    if (cpe) {
      cpe = cpe.trim().toLowerCase();
      this.newOrgAssetsForm.controls['cpe'].setValue(cpe);
      if (cpe.startsWith('cpe:2.3:')) {
        if (cpe.length > 8) {
          const str = cpe.substring(8);
          const info = str.split(':');
          if (info.length >= 1) {
            const part = info[0].toLowerCase().trim();
            if (part.length === 1) {
              switch (part) {
                case 'o':
                  this.newOrgAssetsForm.controls['assettype'].setValue('OS');
                  break;
                case 'a':
                  this.newOrgAssetsForm.controls['assettype'].setValue('Software');
                  break;
                case 'h':
                  this.newOrgAssetsForm.controls['assettype'].setValue('Hardware');
                  break;
                default:
                  this.newOrgAssetsForm.controls['assettype'].setValue('Others');
                  break;
              }
            } else {
              this.newOrgAssetsForm.controls['assettype'].setValue('Category');
            }
          }
          if (info.length >= 2) {
            const vendor = info[1].toLowerCase().trim();
            if (vendor.length > 0 && vendor !== '*') {
              if (vendor !== this.newOrgAssetsForm.controls['vendor'].value.toLowerCase().trim()) {
                this.newOrgAssetsForm.controls['vendor'].setValue(vendor);
              }
            }
          }
          if (info.length >= 3) {
            const product = info[2].toLowerCase().trim();
            if (product.length > 0 && product !== '*') {
              if (product !== this.newOrgAssetsForm.controls['assetname'].value.toLowerCase().trim()) {
                this.newOrgAssetsForm.controls['assetname'].setValue(product);
              }
            }
          }
          if (info.length >= 4) {
            const version = info[3].toLowerCase().trim();
            if (version.length > 0 && version !== '*') {
              if (version !== this.newOrgAssetsForm.controls['version'].value.toLowerCase().trim()) {
                this.newOrgAssetsForm.controls['version'].setValue(version);
              }
            }
          }

          if (cpe.length > 11 && cpe.substring(9, 10) === ':' && cpe.substring(11, 12) !== '*') {
            // If part(assettype) is one character only then proceed with remote validation, otherwise assume the cpe is invalid.
            this.orgAssetsService.validateCpe(this.data.orgId, cpe).subscribe(
              res => {
                if (res.body.totalResults > 0) {
                  this.newOrgAssetsForm.controls['cpematch'].setValue(true);
                }
              },
              (res: HttpErrorResponse) => this.onError(res.message)
            );
          }
        }
      }
    }
  }

  resetFormData() {
    this.updateForm();
    this.newOrgAssetsForm.markAsPristine();
  }

  isValidCPE(cpe: string): boolean {
    const isValid = false;

    return isValid;
  }

  handleCPEKeyup(e: any) {
    this.processCPE(e.target.value);
  }

  handleCPEPaste(e: ClipboardEvent) {
    this.processCPE(e.clipboardData?.getData('text'));
  }

  handleCPECut(e: ClipboardEvent) {
    // Restore form values perhaps
  }

  handleAssetFormDataChange(e: any) {
    const cpeString = this.generateCPEWithFormData();
    this.newOrgAssetsForm.controls['cpe'].setValue(cpeString);
    this.newOrgAssetsForm.controls['cpematch'].setValue(false);
    // Call validation api only if assettype is set. The part component cannot be a logical value.
    if (this.newOrgAssetsForm.controls['assettype'].value) {
      this.orgAssetsService.validateCpe(this.data.orgId, cpeString).subscribe(res => {
        if (
          res.body.totalResults > 0 &&
          this.newOrgAssetsForm.controls['assettype'].value &&
          this.newOrgAssetsForm.controls['vendor'].value &&
          this.newOrgAssetsForm.controls['assetname'].value
        ) {
          this.newOrgAssetsForm.controls['cpematch'].setValue(true);
        }
      });
    }
  }

  generateCPEWithFormData(): string {
    let part = this.newOrgAssetsForm.controls['assettype'].value.toLowerCase();
    if (part === 'os') {
      part = 'o';
    } else if (part === 'hardware') {
      part = 'h';
    } else if (part === 'software') {
      part = 'a';
    } else if (part === 'middleware') {
      part = 'a';
    } else if (part === 'other') {
      part = 'a';
    }
    const vendor = this.newOrgAssetsForm.controls['vendor'].value ? this.newOrgAssetsForm.controls['vendor'].value : '*';
    const product = this.newOrgAssetsForm.controls['assetname'].value ? this.newOrgAssetsForm.controls['assetname'].value : '*';
    const version = this.newOrgAssetsForm.controls['version'].value ? this.newOrgAssetsForm.controls['version'].value : '*';

    const wfn: WFN = new WFN();
    wfn.part = part;
    wfn.vendor = vendor;
    wfn.product = product;
    wfn.version = version;

    return wfn.getCPEUri();
  }

  // clear sub report type
  clearSubReportType() {
    if (this.setupReportForm.value.reportType.name === 'Adhoc') {
      this.setupReportForm.patchValue({ subTypeId: '' }, { onlySelf: true });
    } else {
      this.setupReportForm.patchValue({ subCategoryId: '' }, { onlySelf: true });
    }
  }
  // check form validation
  checkSetupReportsValiddation(): boolean {
    if (
      this.setupReportForm.value.reportType &&
      this.setupReportForm.value.typeOfReport &&
      (this.setupReportForm.value.subTypeId || this.setupReportForm.value.subCategoryId)
    ) {
      return false;
    } else {
      return true;
    }
  }
  updateForm() {
    console.log(this.data);
    const formData = this.data.data;
    if (this.data.action === 'createOrg') {
      this.parentOrgId = formData.parentid;
      this.newOrgForm.setValue({
        name: formData.name,
        aliases: formData.aliases,
        contact: formData.contact,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip: formData.zip,
        parentid: formData.parentid,
        timeZone: formData.timeZone,
        noOfUsers: formData.noOfUsers,
        website: formData.website,
        status: formData.status,
        crmAccountLink: formData.crmAccountLink,
        crmOpportunityLink: formData.crmOpportunityLink,
        moduleName: '',
        startDate: '',
        endDate: '',
        is2fa: formData.is2fa,
        testorg: formData.testorg,
        validateIpAddress: formData.validateIpAddress,
        securitykey: formData.securitykey,
        ipValidations: formData.ipValidations
          ? formData.ipValidations.map((_ip: any) => {
              let ipList = '';
              return (ipList += _ip.ipAddress);
            })
          : '',
        orgType: formData.orgType,
        pov: formData.pov,
        isThirdPartyDomainsEnable: formData.thirdPartyDomainsEnable,
        noOfThirdPartyDomains: formData.noOfThirdPartyDomains,
        noOfDigitalRisksKeyWords: formData.noOfDigitalRisksKeyWords,
      });
    } else if (this.data.action === 'orgDetails') {
      this.newOrgDetailsForm.setValue({
        key: formData.key,
        value: formData.value,
        org: formData.orgId,
      });
    } else if (this.data.action === 'createOrgUser') {
      this.parentOrgId = this.data.data.role.org.parentid;
      const selectedRole: any = this.getRoleById(formData.roleId);
      this.newOrgUserForm.patchValue({ firstname: formData.firstname }, { onlySelf: true });
      this.newOrgUserForm.patchValue({ lastname: formData.lastname }, { onlySelf: true });
      this.newOrgUserForm.patchValue({ email: formData.email }, { onlySelf: true });
      this.newOrgUserForm.patchValue({ phone: formData.phone }, { onlySelf: true });
      this.newOrgUserForm.patchValue({ roleOption: selectedRole }, { onlySelf: true });
      this.newOrgUserForm.patchValue({ status: formData.status }, { onlySelf: true });
    } else if (this.data.action === 'createOrgAssets') {
      this.newOrgAssetsForm.setValue({
        assettype: formData.assettype ? formData.assettype : '',
        assetname: formData.assetname ? formData.assetname : '',
        version: formData.version ? formData.version : '',
        vendor: formData.vendor ? formData.vendor : '',
        comments: formData.comments ? formData.comments : '',
        cpematch: formData.cpematch ? formData.cpematch : '',
        cpe: formData.cpe ? formData.cpe : '',
      });
    } else if (this.data.action === 'setupReports') {
      const rType: ReportTypes = this.getReportTypeById(formData.reportTypeId);
      if (formData.frequencyDetails.length && formData.frequencyDetails[0].defaultTime) {
        const dateTime = new Date(formData.frequencyDetails[0].defaultTime);
        this.timeObj = {
          hour: dateTime.getHours(),
          minute: dateTime.getMinutes(),
          second: dateTime.getMilliseconds(),
        };
      }
      if (formData.frequencyDetails.length && formData.frequencyDetails[0].frequency) {
        this.frequencyDetails = formData.frequencyDetails[0].frequency;
      }
      if (formData.frequencyDetails.length && formData.frequencyDetails[0].day) {
        this.dayDetails = formData.frequencyDetails[0].day;
      }
      this.setupReportForm.setValue({
        reportType: rType,
        subCategoryId: formData.subCategoryId,
        subTypeId: formData.subTypeId,
        defaultTime: this.timeObj,
        email: formData.emailId,
        cc: formData.cc,
        bcc: formData.bcc,
        frequency: this.frequencyDetails,
        day: this.dayDetails,
        subject: formData.templateIds[0].subject,
        body: formData.templateIds[0].body,
        typeOfReport: formData.templateIds[0].typeOfReport,
        passwordProtect: formData.templateIds[0].passwordProtect,
        passwordMailSend: formData.templateIds[0].passwordMailSend,
        password: formData.templateIds[0].password,
      });
    } else if (this.data.action === 'createDataBreachAsset') {
      this.dataBreachAssetsForm.setValue({
        assettype: formData.assettype,
        assetname: formData.assetname,
        location: formData.location ? formData.location : '',
      });
      this.socialHandlerIds = formData.socialHandlerIds;
      this.tempKeys = Object.keys(this.socialHandlerIds);
      this.updateSocialGroup();
    } else if (this.data.action === 'drd-domain') {
      this.drdDomainForm.setValue({
        name: formData.name,
        domain: formData.domain,
        contactPerson: formData.contactPerson,
        email: formData.email,
        type: formData.type,
        company: this.companyIndex,
      });
    } else if (this.data.action === 'drd-company') {
      this.drdCompanyForm.setValue({
        name: formData.name,
        url: formData.url,
        contactPerson: formData.contactPerson,
        email: formData.email,
        address: formData.address,
        status: formData.status,
      });
    } else if (this.data.action === 'drd-domain-keywords') {
      this.drdDomainKeywordsForm.setValue({
        assetType: formData.assetType,
        assetName: formData.assetName,
        location: formData.location,
      });
    } else if (this.data.action === 'drd-domain-keywords-check') {
      this.drdDomainKeywordsCheckForm.setValue({
        domainsimilartoorganization: formData.domainsimilartoorganization,
      });
    } else if (this.data.action === 'createReportConfig') {
      this.timeObj = '';
      this.reportStatus = null;
      this.exclusionOrgList = [];
      if (formData.configValue) {
        if (formData.configKey === 'daily_report_create_time' || formData.configKey === 'daily_report_schedule_time') {
          this.getFileType();
          const dateTime = new Date(formData.configValue);
          this.timeObj = {
            hour: dateTime.getHours(),
            minute: dateTime.getMinutes(),
            second: dateTime.getMilliseconds(),
          };
        } else if (formData.configKey === 'weekly_alerts') {
          this.reportStatus = formData.configValue;
          (<FormGroup>this.setupReportConfigForm).patchValue({ emailTemplate: formData.emailTemplate });
        } else if (formData.configKey === 'daily_reports') {
          this.reportStatus = formData.configValue;
        } else if (formData.configKey === 'report_client_exclusion') {
          this.setupReportConfigForm.patchValue({ configKey: formData.configKey });
          this.getOrgList();
          this.exclusionOrgList = formData.configValue.split(',');
          // (<FormGroup>this.setupReportConfigForm).patchValue({ orgIds: formData.configValue.split(',') });
        }
      }
      this.setupReportConfigForm.setValue({
        configKey: formData.configKey,
        configValue: formData.configValue,
        defaultTime: this.timeObj,
        status: this.reportStatus,
        orgIds: this.exclusionOrgList,
        reportType: formData.reportType,
        emailTemplate: formData.emailTemplate
      });
    } else if (this.data.action === 'third-party-domain') {
      this.tpdForm.patchValue({ assetname: formData.assetname, comment: formData.location });
    }
  }

  onSelectionChange($event: any) {
    this.newOrgDetailsForm.patchValue({ value: '' });
  }

  newOrg(action: any) {
    if (action === 'create') {
      if (this.data.data) {
        const reqObj: any = <Org>this.newOrgForm.value;
        reqObj.id = this.data.data.id;
        if (!!reqObj.ipValidations && reqObj.ipValidations.constructor === Array) {
          reqObj.ipValidations = reqObj.ipValidations.toString();
        }
        if (reqObj.noOfThirdPartyDomains) {
          reqObj.noOfThirdPartyDomains = parseInt(reqObj.noOfThirdPartyDomains, 10);
        }
        if (reqObj.noOfDigitalRisksKeyWords) {
          reqObj.noOfDigitalRisksKeyWords = +reqObj.noOfDigitalRisksKeyWords;
        } else {
          reqObj.noOfDigitalRisksKeyWords = 300;
        }
        this.orgService.update(reqObj).subscribe(
          res => {
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Org' });
              this.closeDialog();
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Org Updated' },
              });
            }
            const user = new User();
            if (reqObj.status === 'Active') {
              user.activated = true;
            } else {
              user.activated = false;
            }
            user.firstName = reqObj.name;
            user.email = reqObj.email;
            user.login = reqObj.email;
            user.authorities = ['ROLE_USER'];
            // Unwanted API called for submit after edit
            // this.userService.edit(user).subscribe(
            //   response => console.log('done'),
            //   err => this.onError(err)
            // );
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <Org>this.newOrgForm.value;
        reqObj.startDate = this.convertDate(reqObj.startDate);
        reqObj.endDate = this.convertDate(reqObj.endDate);
        if (reqObj.isThirdPartyDomainsEnable) {
          reqObj.noOfThirdPartyDomains = parseInt(reqObj.noOfThirdPartyDomains, 10);
        } else {
          reqObj.isThirdPartyDomainsEnable = false;
          delete reqObj.noOfThirdPartyDomains;
        }
        if (
          reqObj.moduleName.indexOf(
            'Basic Solution: Cyber Incident Analytics , Threat Visibility and Intelligence , Cyber Situational Awareness'
          ) > -1
        ) {
          reqObj.moduleName.splice(0, 1);
          reqObj.moduleName.push('Threat Visibility and Intelligence');
          reqObj.moduleName.push('Cyber Incident Analytics');
          reqObj.moduleName.push('Cyber Situational Awareness');
        }
        if (reqObj.noOfDigitalRisksKeyWords) {
          reqObj.noOfDigitalRisksKeyWords = +reqObj.noOfDigitalRisksKeyWords;
        } else {
          reqObj.noOfDigitalRisksKeyWords = 300;
        }
        this.dataCommunicationService.setAjexStatus(true);
        this.orgService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Org' });
              this.closeDialog();
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Org Created' },
              });
              const user = new User();
              user.activated = false;
              user.login = reqObj.email;
              user.firstName = reqObj.name;
              user.email = reqObj.email;
              user.authorities = ['ROLE_USER'];

              this.userService.create(user).subscribe(
                response => console.log('done'),
                err => this.onError(err)
              );

              const csuser = new User();
              if (/ /g.test(reqObj.name)) {
                reqObj.name = reqObj.name.replace(/ /g, '_');
              }
              const cs_email = reqObj.name + '_' + 'CS@cyfirma.com';
              csuser.activated = false;
              csuser.login = cs_email;
              csuser.firstName = reqObj.name;
              csuser.email = cs_email;
              csuser.authorities = ['ROLE_USER'];

              this.userService.create(csuser).subscribe(
                response => console.log('done'),
                err => this.onError(err)
              );
            }
          },
          err => this.onError(err)
        );
      } /* else {
          // this.subscribeToSaveResponse(this.orgService.update(reqObj))
    }*/
    }
  }

  create(action: any) {
    if (action === 'createOrgDetails') {
      if (this.data.data) {
        const reqObj: any = <OrgDetails>this.newOrgDetailsForm.value;
        reqObj.id = this.data.data.id;
        this.orgDetailsService.update(reqObj).subscribe(
          res => {
            this.closeDialog();
            this.dataCommunicationService.setAjexStatus(false);
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Basic Details' });
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully' },
              });
            }
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <OrgDetails>this.newOrgDetailsForm.value;
        reqObj.orgId = this.data.orgId;
        if (reqObj.value) {
          this.orgDetailsService.create(reqObj).subscribe(
            res => {
              this.dataCommunicationService.setAjexStatus(false);
              this.closeDialog();
              if (res.body?.status === 'error') {
                this.dialog.open(MatDialogComponent, {
                  width: '300px',
                  height: '270px',
                  disableClose: false,
                  data: { action: 'API_ERROR', message: res.body.message },
                });
              } else {
                this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Basic Details' });
                this.dialog.open(MatDialogComponent, {
                  width: '300px',
                  height: '270px',
                  disableClose: false,
                  data: { action: 'API_SUCCESS', message: 'Created Successfully' },
                });
              }
            },
            error => this.onError(error)
          );
        }
      }
    } else if (action === 'createOrgUser') {
      if (this.data.data) {
        const reqObj: any = <OrgUser>this.newOrgUserForm.value;
        reqObj.id = this.data.data.id;
        reqObj.roleId = reqObj.roleOption.id;
        reqObj.orgId = this.data.orgId;
        reqObj.status;
        reqObj.updateddate = null;
        reqObj.updatedby = null;
        reqObj.eulaAccept = this.data.data.eulaAccept;
        delete reqObj['roleOption'];
        this.orgUserService.update(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Users' });
              this.closeDialog();
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully' },
              });
            }
            const user = new User();
            if (reqObj.status === 'Active') {
              user.activated = true;
            } else {
              user.activated = false;
            }
            user.firstName = reqObj.firstname;
            user.email = reqObj.email;
            user.login = reqObj.email;
            user.authorities = ['ROLE_USER'];
            this.userService.update(user).subscribe(
              response => console.log('done'),
              err => this.onError(err)
            );
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <OrgUser>this.newOrgUserForm.value;
        reqObj.roleId = reqObj.roleOption.id;
        reqObj.orgId = this.data.orgId;
        reqObj.status = 'Active';
        reqObj.eulaAccept = false;
        delete reqObj['roleOption'];
        this.orgUserService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Users' });
            this.closeDialog();
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Created Successfully' },
              });
              const user = new User();
              user.activated = false;
              user.login = reqObj.email;
              user.firstName = reqObj.firstname;
              // user.lastName = reqObj.lastname;
              user.email = reqObj.email;
              user.authorities = ['ROLE_USER'];
              this.userService.create(user).subscribe(
                response => console.log('done'),
                err => this.onError(err)
              );
            }
          },
          err => this.onError(err)
        );
      }
    } else if (action === 'createOrgAssets') {
      if (this.data.data) {
        const reqObj: any = <OrgAssets>this.newOrgAssetsForm.value;
        this.newOrgAssetsForm.disable();
        reqObj.id = this.data.data.id;
        reqObj.orgId = this.data.orgId;
        reqObj.monitor = 0;
        this.orgAssetsService.update(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
              });
            }
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Assets' });
            this.newOrgAssetsForm.enable();
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <OrgAssets>this.newOrgAssetsForm.value;
        this.newOrgAssetsForm.disable();
        reqObj.orgId = this.data.orgId;
        reqObj.monitor = 0;
        this.orgAssetsService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Created Successfully.' },
              });
            }
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Assets' });
            this.newOrgAssetsForm.enable();
          },
          err => this.onError(err)
        );
      }
    } else if (action === 'setupReports') {
      if (this.data.data) {
        const reqObj: any = <OrgReportFrequency>this.setupReportForm.value;
        reqObj.id = this.data.data.id;
        reqObj.orgId = this.data.orgId;
        reqObj.reportType = this.setupReportForm.value.reportType.id;
        reqObj.emailId = reqObj.email;
        if (reqObj.defaultTime) {
          const publishedDate = new Date();
          publishedDate.setHours(reqObj.defaultTime.hour, reqObj.defaultTime.minute, reqObj.defaultTime.second);
          reqObj.defaultTime = publishedDate.toString();
        }
        if (!reqObj.passwordProtect) {
          reqObj.passwordMailSend = null;
          reqObj.password = null;
        }
        this.orgReportRecipientService.update(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Reports' });
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
              });
            }
          },
          err => {
            //
          }
        );
      } else {
        const reqObj: any = <OrgReportRecipient>this.setupReportForm.value;
        reqObj.orgId = this.data.orgId;
        reqObj.reportType = reqObj.reportType.id;
        reqObj.subCategoryId = reqObj.subCategoryId.id;
        reqObj.emailId = reqObj.email;
        if (reqObj.defaultTime) {
          const publishedDate = new Date();
          publishedDate.setHours(reqObj.defaultTime.hour, reqObj.defaultTime.minute, reqObj.defaultTime.second);
          reqObj.defaultTime = publishedDate.toString();
        }
        reqObj.frequency = reqObj.frequency.id;
        if (!reqObj.passwordProtect) {
          reqObj.passwordMailSend = null;
          reqObj.password = null;
        }
        this.orgReportRecipientService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Reports' });
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Created Successfully.' },
              });
            }
          },
          err => {
            //
          }
        );
      }
    } else if (action === 'createDataBreachAsset') {
      if (this.data.data) {
        const reqObj: any = <OrgAssets>this.dataBreachAssetsForm.value;
        reqObj.id = this.data.data.id;
        reqObj.orgId = this.data.orgId;
        reqObj.monitor = 1;
        if (['Product Name', 'Individuals Name'].includes(this.dataBreachAssetsForm.value.assettype)) {
          reqObj.socialHandlerIds = this.socialHandlerIds;
        }
        this.orgAssetsService.update(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
              });
            }
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Digital Risk Keywords' });
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <OrgAssets>this.dataBreachAssetsForm.value;
        reqObj.orgId = this.data.orgId;
        reqObj.monitor = 1;
        if (['Product Name', 'Individuals Name'].includes(this.dataBreachAssetsForm.value.assettype)) {
          reqObj.socialHandlerIds = this.socialHandlerIds;
        }
        this.orgAssetsService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            if (res.body?.status === 'error') {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_ERROR', message: res.body.message },
              });
            } else {
              this.dialog.open(MatDialogComponent, {
                width: '300px',
                height: '270px',
                disableClose: false,
                data: { action: 'API_SUCCESS', message: 'Created Successfully.' },
              });
            }
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Digital Risk Keywords' });
          },
          err => {
            this.onError(err);
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_ERROR', message: err.error.message },
            });
          }
        );
      }
    } else if (action === 'drd-domain') {
      this.dataCommunicationService.setAjexStatus(true);
      const req = this.drdDomainForm.value;
      if (this.data.data) {
        req.id = this.data.data.id;
        req.orgId = this.data.orgId;
        req.companyId = this.data.companyId;
        req.companyName = this.data.companyName;
        this.orgDetailsService.updateDRDDomain(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Digital Risk Discovery' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else {
        req.orgId = this.data.orgId;
        req.companyId = this.data.companyId;
        req.companyName = this.data.companyName;
        this.orgDetailsService.addDRDDomain(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Digital Risk Discovery' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      }
    } else if (action === 'drd-domain-keywords') {
      this.dataCommunicationService.setAjexStatus(true);
      const req = this.drdDomainKeywordsForm.value;
      req.drddomainId = this.data.drdId;
      if (this.data.data) {
        req.id = this.data.data.id;
        req.orgId = this.data.data.orgId ? this.data.data.orgId : this.selectedOrg;
        this.orgDetailsService.updateDRDDomainKeyword(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Domain Keywords' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else {
        req.orgId = this.selectedOrg;
        this.orgDetailsService.addDRDDomainKeyword(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Domain Keywords' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      }
    } else if (action === 'drd-domain-keywords-check') {
      this.dataCommunicationService.setAjexStatus(true);
      const req = this.drdDomainKeywordsCheckForm.value;
      req.drddomainId = this.data.drdId;
      if (this.data.data) {
        req.id = this.data.data.id;
        req.orgId = this.data.data.orgId ? this.data.data.orgId : this.selectedOrg;
        this.orgDetailsService.updateDRDDomainKeyword(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Domain Keywords' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else {
        req.orgId = this.selectedOrg;
        this.orgDetailsService.addDRDDomainKeyword(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Domain Keywords' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      }
    } else if (action === 'createReportConfig') {
      if (this.data.data) {
        const reqObj: any = <OrgReportConfig>this.setupReportConfigForm.value;
        reqObj.id = this.data.data.id;
        reqObj.orgId = this.data.orgId;
        if (reqObj.defaultTime) {
          const date = new Date();
          date.setHours(reqObj.defaultTime.hour, reqObj.defaultTime.minute, reqObj.defaultTime.second);
          reqObj.configValue = date.toString();
        } else if (reqObj.status) {
          reqObj.configValue = reqObj.status;
        } else if (reqObj.orgIds) {
          reqObj.configValue = reqObj.orgIds.join(',');
          const orgNameList: any = [];
          reqObj.orgIds.map((id: any) => {
            this.orgsNames.map(orgs => {
              if (orgs.id === id) {
                if (orgs.name) {
                  orgNameList.push(orgs.name);
                }
              }
            });
          });
          reqObj.orgNames = orgNameList.join(',');
          // reqObj.configValue = Array.prototype.map.call(reqObj.orgIds, function(item) { return item.id; }).join(",");
          // reqObj.orgNames = Array.prototype.map.call(reqObj.orgIds, function(item) { return item.name; }).join(",");
        }
        delete reqObj.defaultTime;
        delete reqObj.status;
        delete reqObj.orgIds;
        this.orgReportConfigService.update(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Report Config' });
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_SUCCESS', message: 'Updated Successfully.' },
            });
          },
          err => this.onError(err)
        );
      } else {
        const reqObj: any = <OrgReportConfig>this.setupReportConfigForm.value;
        reqObj.orgId = this.data.orgId;
        if (reqObj.defaultTime) {
          const date = new Date();
          date.setHours(reqObj.defaultTime.hour, reqObj.defaultTime.minute, reqObj.defaultTime.second);
          reqObj.configValue = date.toString();
        } else if (reqObj.status) {
          reqObj.configValue = reqObj.status;
        } else if (reqObj.orgIds) {
          reqObj.configValue = reqObj.orgIds.join(',');
          const orgNameList: any = [];
          reqObj.orgIds.map((id: any) => {
            this.orgsNames.map(orgs => {
              if (orgs.id === id) {
                if (orgs.name) {
                  orgNameList.push(orgs.name);
                }
              }
            });
          });
          reqObj.orgNames = orgNameList.join(',');
          // reqObj.configValue = Array.prototype.map.call(reqObj.orgIds, function(item) { return item.id; }).join(",");
          // reqObj.orgNames = Array.prototype.map.call(reqObj.orgIds, function(item) { return item.name; }).join(",");
        }
        delete reqObj.defaultTime;
        delete reqObj.status;
        delete reqObj.orgIds;
        this.orgReportConfigService.create(reqObj).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'Report Config' });
            this.dialog.open(MatDialogComponent, {
              width: '300px',
              height: '270px',
              disableClose: false,
              data: { action: 'API_SUCCESS', message: 'Created Successfully.' },
            });
          },
          err => this.onError(err)
        );
      }
    } else if (action === 'drd-company') {
      this.dataCommunicationService.setAjexStatus(true);
      const req = this.drdCompanyForm.value;
      if (this.data.data) {
        req.id = this.data.data.id;
        req.orgId = this.data.orgId;
        this.orgDetailsService.updateDRDCompany(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'DRD Company' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      } else {
        req.orgId = this.data.orgId;
        req.status = 'Active';
        this.orgDetailsService.addDRDCompany(req).subscribe(
          res => {
            this.dataCommunicationService.setAjexStatus(false);
            this.closeDialog();
            this.dataCommunicationService.setApiStatus({ status: 'success', action: 'DRD Company' });
          },
          (error: HttpErrorResponse) => this.onError(error)
        );
      }
    } else if (action === 'addTPD') {
      const req: any = {
        assetname: this.tpdForm.value.assetname,
        location: this.tpdForm.value.comment,
        orgId: this.data.orgId,
      };
      if (this.data.data) {
        req['id'] = this.data.data.id;
        (req['assettype'] = this.data.data.assettype),
          (req['comment'] = this.data.data.location),
          (req['monitor'] = this.data.data.monitor);
      }
      this.addTPD(req);
    }
  }

  getRoles(orgId: any) {
    this.roleService.query(orgId).subscribe(
      (res: HttpResponse<Role[]>) => {
        this.roles = res.body as any;
        this.updateForm();
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
  }
  getRoleById(roleId: any) {
    return this.roles.filter(role => role.id === roleId)[0];
  }
  getCompanyById(orgId: any) {
    this.dataCommunicationService.setAjexStatus(true);
    const drdCompanyReq = {
      orgId,
    };
    this.orgDetailsService.getDRDCompany(drdCompanyReq).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dataCommunicationService.setAjexStatus(false);
        this.companies = res.body!.map(cp => {
          const company = {
            companyName: cp.name,
            id: cp.id,
          };
          return company;
        });
        this.companyIndex = res.body!.findIndex(obj => obj.id === this.data.data.companyId);
      },
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  getFileType() {
    this.fileTypeService.getReportTypes().subscribe(
      (res: HttpResponse<ReportTypes[]>) => {
        this.reportTypes = res.body as any;
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
  }

  getReportTypeById(reportTypeId: any) {
    return this.reportTypes.filter(report => report.id === reportTypeId)[0];
  }

  getSubCategories() {
    this.subCategoryService.getSubCategories().subscribe(
      (res: HttpResponse<SubCategory[]>) => {
        this.subCategory = res.body as any;
      },
      (err: HttpErrorResponse) => {
        //
      }
    );
  }

  getSubTypes() {
    this.subTypeService.getSubTypes().subscribe(
      (res: HttpResponse<SubType[]>) => {
        this.subType = res.body as any;
      },
      (err: HttpErrorResponse) => {
        //
      }
    );
  }

  downloadIndustryList() {
    this.dataCommunicationService.setAjexStatus(true);
    this.orgDetailsService.downloadIndustryList().subscribe(
      res => {
        this.dataCommunicationService.setAjexStatus(false);
        const response: any = res;
        const blob = new Blob([response], { type: '*' });
        saveAs(blob, 'Industry_Classification_Table.xlsx');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  getFilterOptions() {
    // this.saDashboardService.getAllIndustryCategories().subscribe((res) => {
    //   this.industryList = res.body;
    // }, (err: HttpErrorResponse) => this.onError(err));
    this.saDashboardService.getAllInductry().subscribe(
      res => {
        this.industryList = res.body as any;
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
    this.saDashboardService.getAllTechnology().subscribe(
      res => {
        this.technologyList = res.body as any;
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
    this.saDashboardService.getAllCountry().subscribe(
      res => {
        this.geographyList = res.body as any;
      },
      (err: HttpErrorResponse) => this.onError(err)
    );
  }

  changeCompany(data: any) {
    this.data.companyId = this.companies[data].id;
    this.data.companyName = this.companies[data].companyName;
  }

  loadGITOptions(data?: any) {
    this.geographiesOptions = this.dataCommunicationService.loadGIT('geography');
    this.industriesOptions = this.dataCommunicationService.loadGIT('industry');
    this.technologiesOptions = this.dataCommunicationService.loadGIT('technology');

    this.gitFilterInfo['industry'].config = this.dataCommunicationService.getFilterConfigByType('industry');
    this.gitFilterInfo['industry'].list = <any>this.industriesOptions;
    this.gitFilterInfo['technology'].config = this.dataCommunicationService.getFilterConfigByType('technology');
    this.gitFilterInfo['technology'].list = <any>this.technologiesOptions;
    this.gitFilterInfo['geography'].config = this.dataCommunicationService.getFilterConfigByType('geography');
    this.gitFilterInfo['geography'].list = <any>this.geographiesOptions;

    if (data) {
      if (this.data.label === 'Update Attributes') {
        if (data.key === 'People') {
          this.newOrgDetailsForm.patchValue({ key: data.key }, { onlySelf: true });
          this.newOrgDetailsForm.patchValue({ value: data.value }, { onlySelf: true });
        } else {
          this.gitFilterInfo[data.key.toLowerCase()].config['value'] = data.value;
        }
      }
    }
  }

  validIPToggle(event: any) {
    this.validateIpAddress = event.checked;
    if (this.validateIpAddress) {
      this.newOrgForm.get('ipValidations')?.setValidators(Validators.required);
    } else {
      this.newOrgForm.get('ipValidations')?.clearValidators();
      this.newOrgForm.get('ipValidations')?.updateValueAndValidity();
    }
  }
  // add/update third party domain
  addTPD(req: any) {
    console.log(req);
    this.dataCommunicationService.setAjexStatus(true);
    this.orgAssetsService.createThirdPartyDomain(req).subscribe(
      (res: HttpResponse<any[]>) => {
        this.dataCommunicationService.setAjexStatus(false);
        let _message;
        if (req.id) {
          _message = 'Updated Successfully';
        } else {
          _message = 'Created Successfully';
        }
        this.ds.showApiStatus({ action: 'API_SUCCESS', message: _message });
        this.closeDialog(true);
      },
      (error: HttpErrorResponse) => {
        this.closeDialog(false);
        if (error.error?.message) {
          this.ds.showApiStatus({ action: 'API_ERROR', message: error.error.message });
        } else {
          this.ds.showApiStatus({ action: 'API_ERROR', message: error.message });
        }
        this.onError(error);
      }
    );
  }
  // catch event on selection change::
  onOptionSelection(e: any) {
    this.selectedGITOption = e;
    this.newOrgDetailsForm.patchValue({ value: e.name }, { onlySelf: true });
  }
  private convertDate(reqObj: any) {
    reqObj = this.dateUtils.convertLocalDateToServer(reqObj);
    return reqObj;
  }

  getOrgList() {
    (<FormGroup>this.setupReportConfigForm).patchValue({ status: '', reportType: '' });
    if (
      this.setupReportConfigForm.value.configKey === 'report_client_exclusion' ||
      this.setupReportConfigForm.value.configKey === 'daily_report_schedule_time'
    ) {
      this.orgService.findAllOrgNames(this.data.orgId).subscribe(
        res => {
          this.orgsNames = res.body as any;
        },
        (err: HttpErrorResponse) => this.onError(err)
      );
      this.getFileType();
    }
  }

  startdateChange(event: any) {
    if (this.trialRef) {
      const dt = new Date();
      // console.log(dt);
      dt.setDate(event.day + 21);
      // console.log(dt);
      this.endDate = { day: dt.getDate(), month: dt.getMonth() + 1, year: dt.getFullYear() };
      // console.log(this.endDate)
    }
  }
  onKeypressEvent(event: any): boolean {
    if (this.trialRef) {
      const charCode = event.which ? event.which : event.keyCode;
      if (
        (charCode === 49 || charCode === 50 || charCode === 97 || charCode === 98) &&
        this.newOrgForm.controls['noOfUsers'].value.length < 1
      ) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  saveSocialHandler() {
    if (this.tempSocial.social === '' || this.tempSocial.value === '') {
      return;
    }
    this.socialHandlerIds = { ...this.socialHandlerIds, [this.tempSocial.social]: this.tempSocial.value };
    this.tempKeys = Object.keys(this.socialHandlerIds);
    this.tempSocial = { social: '', value: '' };
  }

  editSocialHandler(item: any) {
    this.tempSocial = { social: item, value: this.socialHandlerIds[item] };
    $('.mat-dialog-container').animate(
      {
        scrollTop: $('#social-handler-form')?.offset()?.top,
      },
      100
    );
  }

  removeSocialHandler(item: any) {
    if (item === this.tempSocial.social) {
      this.tempSocial = { social: '', value: '' };
    }
    delete this.socialHandlerIds[item];
    this.tempKeys = Object.keys(this.socialHandlerIds);
  }

  onSelectLogo(e: any, draged: boolean): void {
    let imgFile: any = null;
    if (draged) {
      imgFile = e;
    } else {
      imgFile = e.target.files;
    }
    if (imgFile && imgFile[0]) {
      let reader = new FileReader();
      reader.onload = (evt: any) => {
        this.logoUrl = evt.target.result;
      };
      if (imgFile[0].size < 65536) {
        this.tmpImage = imgFile[0];
        reader.readAsDataURL(imgFile[0]);
      } else {
        this.dialog.open(MatDialogComponent, {
          width: '300px',
          height: '270px',
          disableClose: false,
          data: { action: 'API_ERROR', message: 'Size Restriction Exceeded.'}
        });
      }
    }
  }

  previewLogo(): void {
    this.dataCommunicationService.changeLogo(this.logoUrl);
  }

  uploadLogo(): void {
    this.dataCommunicationService.setAjexStatus(true);
    this.orgService.uploadCompanyLogo(this.data.orgId, this.tmpImage).subscribe((res: any) => {
      this.dataCommunicationService.setAjexStatus(false);
      if (res.status === 'success') {
        let reader = new FileReader();
        reader.onload = (evt: any) => {
          this.logoUrl = evt.target.result;
          this.dataCommunicationService.changeLogo(this.logoUrl);
          this.logoUpdated = true;
        };
        reader.readAsDataURL(this.tmpImage);
        this.dialog.open(MatDialogComponent, {
          width: '300px',
          height: '270px',
          disableClose: false,
          data: { action: 'API_SUCCESS', message: 'Logo Updated Successfully.' }
        });
      } else {
        this.dialog.open(MatDialogComponent, {
          width: '300px',
          height: '270px',
          disableClose: false,
          data: { action: 'API_ERROR', message: res.message }
        });
      }
    }, (error: any) => this.onError(error));
  }

  private onError(error: any) {
    this.dataCommunicationService.setAjexStatus(false);
  }
}
