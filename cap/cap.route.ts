import { Route } from '@angular/router';
import { UserRouteAccessService } from '../shared';
import { CapComponent } from './';

import { CyberThreatComponent } from '../cyber-threat/cyber-threat.component';
import { DashboardComponent } from '../cyber-threat/dashboard/dashboard.component';
import { CyberThreatListComponent } from '../cyber-threat/list/list.component';
import { DetailsComponent } from '../cyber-threat/details/details.component';

import { SituationalComponent } from '../situational/situational.component';
import { SAListComponent } from '../situational/list/list.component';
import { SituationalDashboardComponent } from '../situational/dashboard/dashboard.component';
import { SituationalDetailsComponent } from '../situational/details/details.component';
import { SituationalSearchComponent } from '../situational/situational-search/situational-search.component';

import { CyberIncidentComponent, CIDashboardComponent, CIAListComponent, CIDetailsComponent } from '../cyber-incident';

import { VulnerabilityComponent, VulnerabilityDashboardComponent, VulnerabilityDetailsComponent } from '../vulnerability';

import { CyberRiskComponent, CRDashboardComponent } from '../cyber-risk';

import { RiskMonitoringComponent, RMDashboardComponent } from '../risk-monitoring';

import { TrendsListViewComponent } from '../trends/trends-list-view/trends-list-view.component';
import { TrendsDetailsViewComponent } from '../trends/trends-details-view/trends-details-view.component';

import { ReportsComponent } from '../reports/reports.component';
import { FileReportComponent } from '../reports/file-report/filereport.component';
import { HtmlReportsComponent } from '../reports/html-report/htmlreports.component';
import { HtmlDetailsComponent } from '../reports/html-report/details/details.component';
import { FileDetailsComponent } from '../reports/file-report/details/details.component';
import { RecommendationComponent } from '../reports/recommendation/recommendation.component';
import { CyfirmaViewsComponent } from '../reports/cyfrima-views/cyfirma-views.component';
import { ArticleComponent } from '../reports/article/article.component';
import { ManageIocComponent } from '../reports/manage-ioc/manage-ioc.component';
import { OnlineDetailsComponent } from '../reports/online-reports/details/online-details.component';
import { OnlineReportsComponent } from '../reports/online-reports/online-reports.component';
import { AttackMethodComponent } from '../modules/tvi/executive/drilldownlist/attackmethod.component';

import { OrgComponent, OrgDetailsComponent, OrgResolvePagingParams } from '../org';
import { CybereduComponent, CyberEduDetailsComponent } from '../cyberedu';
import { AnalystComponent } from '../account/analyst/analyst.component';

import {
  CoreDashboardComponent,
  CoreComponent,
  FeedComponent,
  BlogComponent,
  RssComponent,
  FacebookComponent,
  TwitterComponent,
  LinkedinComponent,
  SocialComponent,
  RssDetailsComponent,
  RansomwareComponent,
  SocialDetailsComponent,
  ExploitComponent,
  BlogDetailsComponent,
  ThreatActorComponent,
  CoreVulnerabilityComponent,
  PhishingComponent,
  ExploitDetailComponent,
  ThreatActorDetailComponent,
  MLLearningComponent,
  LearningDetailComponent,
  CoreVulnerabilityDetailsComponent,
  PhishingDetailsComponent,
  RedditComponent,
  SearchFeedComponent,
  CweToThreatTechniqueComponent,
  DatabreachComponent,
  CoreEarlyWarningComponent,
  CyberEventComponent,
  CyberAttacksComponent,
  MasterDataComponent,
  CoreEngineComponent,
  MalwareComponent,
  FAQComponent,
  DarkWebComponent,
  DatabreachIpVulnerabilityComponent,
  DailySnapshotComponent,
  HelpComponent,
  DigitalRiskApiResultsComponent,
  RecentCampaignComponent,
  MasterApiListComponent,
  ClientIncidentComponent,
  IocAnalysisComponent,
  ThreatLandscapeMasterComponent,
  CoreVulnerabilityExploitComponent,
  CoreAttackSurfaceComponent,
  CoreDigitalRiskComponent,
  CoreMasterSchedulerComponent,
} from '../core/index';

import { HelpMenuComponent } from '../help-menu/help-menu.component';
import { FAQMenuComponent } from '../faq-menu/faq-menu.component';
import { ReleaseNotesComponent } from '../release-notes/release-notes.component';
import {
  AlertCenterComponent,
  EarlyWarningComponent,
  SearchListComponent,
  NewsDetailsComponent,
  AdvanceSearchComponent,
  AdvanceSearchDetailsComponent,
  ReportViewComponent,
} from '../shared/components';
import { DrdListComponent, DrdDetailsComponent } from '../modules/tvi';
import { TviComponent, TviOperationsComponent, TviExecutiveComponent, TviManagementComponent, TviListViewComponent } from '../modules/tvi';
import { DrdComponent } from '../modules/tvi/drd/drd.component';
import { SituationalAwarenessComponent } from '../modules/tvi/executive/drilldownlist/situational-awareness.component';
import { FileAnalysisDetailsComponent } from '../modules/tvi/list-view/file-analysis/details/file-analysis-details.component';
import { CoreThreatActorMalwareCampaignComponent } from '../core/threat-actor-malware-and-campaign/threat-actor-malware-and-campaign.component';
import { CoreHelpSupportComponent } from '../core/help-and-support/help-and-support.component';
import { CoreReportComponent } from '../core/report/report.component';
import { AnalystNewComponent } from '../account/analyst-new/analyst-new.component';
import { SitutionalAwarenessDetailsComponent } from '../modules/tvi/list-view/situtional-awareness/situtional-awareness-details.component';
import { CoreMaliciousMobileAppComponent } from '../core/malicious-mobile-app/malicious-mobile-app.component';
import { CoreCloudWeaknessComponent } from '../core/cloud-weakness/cloud-weakness.component';
import { ThirdPartyDomainComponent } from '../modules/tvi/list-view/third-party-domain/third-party-domain.component';
import { ThirdPartyDomainDetailsComponent } from '../modules/tvi/list-view/third-party-domain/third-party-domain-details/third-party-domain-details.component';
import { CoreExportDataComponent } from '../core/export-data/export-data.component';
import { DigitalRiskDetails } from '../modules/tvi/list-view/digitalrisk/digitalrisk.component';
import { CoreDomainsReportComponent } from '../core/domains-report/domains-report.component';
import { CoreSurfaceWebComponent } from '../core/surface-web/surface-web.component';
import { CoreClientThreatCorrelationComponent } from '../core/client-threat-correlation/client-threat-correlation.component';
import { MsspDashboardComponent } from '../mssp-dashboard/mssp-dashboard.component';
import { CorePhishingComponent } from '../core/core-phishing/core-phishing.component';
import { CoreLolbasComponent } from '../core/lolbas/lolbas.component';
import { CorrelationDashboardComponent } from '../modules/tvi/correlation-dashboard/correlation-dashboard.component';
import { CoreConfidentialFileComponent } from '../core/confidential-file/confidential-file.component';
import { CorePiiCiiComponent } from '../core/piicii/piicii.component';
import { OrglistComponent } from 'app/core/orglist/orglist.component';




export const CAP_ROUTE: Route = {
  path: 'cap',
  component: CapComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.title',
  },
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'tvi',
    },
    {
      path: 'tvi',
      component: TviComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberThreat.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'executive',
        },
        {
          path: 'operations',
          component: TviOperationsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.operations.pageTitle',
          },
        },
        {
          path: 'list-view',
          component: TviListViewComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.operations.listTitle',
          },
        },
        {
          path: 'list-view/third-party-domain',
          component: ThirdPartyDomainComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.tpd.pageTitle',
          },
        },
        {
          path: 'list-view/third-party-domain/details',
          component: ThirdPartyDomainDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.tpd.detailsPageTitle',
          },
        },
        {
          path: 'details-view/sa',
          component: SitutionalAwarenessDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.operations.detailsTitle',
          },
        },
        {
          path: 'executive',
          component: TviExecutiveComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'digital-risk',
          component: DigitalRiskDetails,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'digitalRisk.title',
          },
        },
        {
          path: 'attack-method',
          component: AttackMethodComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'situational-awareness',
          component: SituationalAwarenessComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'management',
          component: TviManagementComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'report-view',
          component: ReportViewComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.reports.title',
          },
        },
        {
          path: 'drd',
          component: DrdComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.drd.title',
          },
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'drd/domain',
          component: DrdListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.drd.title',
          },
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'drd/domain-details',
          component: DrdDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.drd.title',
          },
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'file-analysis',
          component: FileAnalysisDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.listview.fileAnalysis.title',
          },
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'correlation-dashboard',
          component: CorrelationDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
          canActivate: [UserRouteAccessService],
        },
      ],
    },
    {
      path: 'cyber-threat',
      component: CyberThreatComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberThreat.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'list',
          component: CyberThreatListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'list/:name',
          component: CyberThreatListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
        {
          path: 'dashboard/:name',
          component: DetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberThreat.title',
          },
        },
      ],
    },
    {
      path: 'situational',
      component: SituationalComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.situational.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: SituationalDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'details',
          component: SituationalDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'details/:name',
          component: SituationalDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'list',
          component: SAListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'list/:name',
          component: SAListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'search',
          component: SituationalSearchComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.situational.title',
          },
        },
        {
          path: 'report-view',
          component: ReportViewComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.reports.title',
          },
        },
      ],
    },
    {
      path: 'trends/list-view/:name',
      component: TrendsListViewComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.trendsV',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'trends/details-view/:name',
      component: TrendsDetailsViewComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.trendsV',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'reports',
      component: ReportsComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.reports.title',
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'online-reports-new',
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.htmlreport.title',
          },
        },
        {
          path: 'online-reports-new',
          component: OnlineReportsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.onlinereportnew.title',
          },
        },
        {
          path: 'online-reports-new/:id',
          component: OnlineDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.onlinereportnew.title',
          },
        },
        {
          path: 'htmlreport',
          component: HtmlReportsComponent,
        },
        {
          path: 'htmlreport/:id',
          component: HtmlDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.htmlreport.title',
          },
        },
        {
          path: 'filereport',
          component: FileReportComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.filereport.title',
          },
        },
        {
          path: 'filereport/:id',
          component: FileDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.filereport.title',
          },
        },
        {
          path: 'recommendation',
          component: RecommendationComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.recommendation.title',
          },
        },
        {
          path: 'cyfirmaview',
          component: CyfirmaViewsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyfirmaviews.title',
          },
        },
        {
          path: 'article',
          component: ArticleComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.articles.title',
          },
        },
        {
          path: 'manageioc',
          component: ManageIocComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.manageioc.title',
          },
        },
      ],
    },
    {
      path: 'cyberedu',
      component: CybereduComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberedu.title',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'cyberedu/:name',
      component: CyberEduDetailsComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberedu.title',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'analyst-view',
      component: AnalystComponent,
      data: {
        pageTitle: 'global.menu.account.analyst',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'analyst-view-new',
      component: AnalystNewComponent,
      data: {
        pageTitle: 'global.menu.account.analystNew',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'release-notes',
      component: ReleaseNotesComponent,
      data: {
        pageTitle: 'cyfirmaweb.releasenotes.title',
      },
    },
    {
      path: 'help-menu',
      component: HelpMenuComponent,
      data: {
        pageTitle: 'help.title',
      },
    },
    {
      path: 'faq-menu',
      component: FAQMenuComponent,
      data: {
        pageTitle: 'faq.title',
      },
    },
    {
      path: 'vulnerability',
      component: VulnerabilityComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.vulnerability.title',
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: VulnerabilityDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability.title',
          },
        },
        {
          path: 'dashboard/:name',
          component: VulnerabilityDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability.title',
          },
        },
        {
          path: 'dashboard/reports/:id',
          component: ReportsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability.title',
          },
        },
      ],
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'cyber-incident',
      component: CyberIncidentComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberIncident.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: CIDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: 'list',
          component: CIAListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: 'list/:name',
          component: CIAListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: ':name',
          component: CIDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: ':name/details',
          component: CIDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: 'dashboard/:name',
          component: CIDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: ':name/report-view',
          component: ReportViewComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.reports.title',
          },
        },
      ],
    },
    {
      path: 'cyber-risk',
      component: CyberRiskComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberRiskScoring.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: CRDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberRiskScoring.title',
          },
        },
      ],
    },
    {
      path: 'risk-monitoring',
      component: RiskMonitoringComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.cyberRiskMonitor.title',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          component: RMDashboardComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberRiskMonitor.title',
          },
        },
      ],
    },
    {
      path: 'core',
      component: CoreComponent,
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'core',
      },
      canActivate: [UserRouteAccessService],
      children: [
        {
          path: 'dashboard',
          component: CoreDashboardComponent,
          // canActivate: [false],
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.feed.title',
          },
        },
        {
          path: 'malicious',
          component: CoreMaliciousMobileAppComponent,
          // canActivate: [false],
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.malicious-mobile-app.title',
          },
        },
        {
          path: 'domains-report',
          component: CoreDomainsReportComponent,
          // canActivate: [false],
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.domains-report.title',
          },
        },
        {
          path: 'feed',
          component: FeedComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.feed.title',
          },
        },
        {
          path: 'blog',
          component: BlogComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.blog.title',
          },
        },
        {
          path: 'blog/:url',
          component: BlogDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.blog.title',
          },
        },
        {
          path: 'facebook',
          component: FacebookComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.facebook.title',
          },
        },
        {
          path: 'twitter',
          component: TwitterComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.twitter.title',
          },
        },
        {
          path: 'rss',
          component: RssComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.rss.title',
          },
        },
        {
          path: 'rss/:id',
          component: RssDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.rss.title',
          },
        },
        {
          path: 'linkedin',
          component: LinkedinComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.linkedin.title',
          },
        },
        {
          path: 'social',
          component: SocialComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.social.title',
          },
        },
        {
          path: 'social/:id',
          component: SocialDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.social.title',
          },
        },
        {
          path: 'exploit',
          component: ExploitComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.exploit.title',
          },
        },
        {
          path: 'ransomware',
          component: RansomwareComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.ransomware.title',
          },
        },
        {
          path: 'exploit/:name',
          component: ExploitDetailComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.exploit.title',
          },
        },
        {
          path: 'threatActor',
          component: ThreatActorComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.threatActor.title',
          },
        },
        {
          path: 'threatActorDetail/:id',
          component: ThreatActorDetailComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.threatActor.title',
          },
        },
        {
          path: 'learning',
          component: MLLearningComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.learning.title',
          },
        },
        {
          path: 'learningDetail/:id',
          component: LearningDetailComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.learning.title',
          },
        },
        {
          path: 'vulnerability',
          component: CoreVulnerabilityComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability.title',
          },
        },
        {
          path: 'vulnerability/:name',
          component: CoreVulnerabilityDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability.title',
          },
        },
        {
          path: 'phishing',
          component: CorePhishingComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.phishing.title',
          },
        },
        {
          path: 'phishing/:name',
          component: PhishingDetailsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.phishing.title',
          },
        },
        {
          path: 'reddit',
          component: RedditComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.reddit.title',
          },
        },
        {
          path: 'searchfeed',
          component: SearchFeedComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.searchfeed.title',
          },
        },
        {
          path: 'cwe',
          component: CweToThreatTechniqueComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cwetothreattechnique.title',
          },
        },
        {
          path: 'databreach',
          component: DatabreachComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.databreach.title',
          },
        },
        {
          path: 'earlywarning',
          component: CoreEarlyWarningComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.earlywarning.title',
          },
        },
        {
          path: 'cyberIncident',
          component: CyberEventComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberIncident.title',
          },
        },
        {
          path: 'cyberAttacks',
          component: CyberAttacksComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberAttacks.title',
          },
        },
        {
          path: 'masterTags',
          component: MasterDataComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.masterData.title',
          },
        },
        {
          path: 'core-engine',
          component: CoreEngineComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.coreEngine.title',
          },
        },
        {
          path: 'malware',
          component: MalwareComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.malware.title',
          },
        },
        {
          path: 'cyberAttacks',
          component: CyberAttacksComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cyberAttacks.title',
          },
        },
        {
          path: 'faq',
          component: FAQComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.faq.title',
          },
        },
        {
          path: 'clientIncidents',
          component: ClientIncidentComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.clientIncidents.title',
          },
        },
        {
          path: 'darkWeb',
          component: DarkWebComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.darkWeb.title',
          },
        },
        {
          path: 'databreachIpVulnerability',
          component: DatabreachIpVulnerabilityComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.databreachIpVulnerability.title',
          },
        },
        {
          path: 'currentSnapshot',
          component: DailySnapshotComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.currentSnapshot.title',
          },
        },
        {
          path: 'help',
          component: HelpComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.help.title',
          },
        },
        {
          path: 'digitalRiskApiResults',
          component: DigitalRiskApiResultsComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.digitalRiskApiResults.title',
          },
        },
        {
          path: 'recentCampaign',
          component: RecentCampaignComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.recentCampaign.title',
          },
        },
        {
          path: 'masterApiList',
          component: MasterApiListComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.masterApiList.title',
          },
        },
        {
          path: 'iocAnalysis',
          component: IocAnalysisComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.iocAnalysis.title',
          },
        },
        {
          path: 'threatLandscapeMaster',
          component: ThreatLandscapeMasterComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.threatLandscapeMaster.title',
          },
        },

        

        // By Vishnu Avtar

        // {
        //   path: 'cap/org',
        //   component: OrgComponent,
        //   resolve: {
        //     pagingParams: OrgResolvePagingParams,
        //   },
        //   data: {
        //     authorities: ['ROLE_USER'],
        //     pageTitle: 'orgs.org.title',
        //   },
        //   canActivate: [UserRouteAccessService],
        // },

        // {
        //   path: 'orglist',
        //   component: CoreOrgComponent,
        //   resolve: {
        //     pagingParams: OrgResolvePagingParams,
        //   },
        //   data: {
        //     authorities: ['ROLE_USER'],
        //     pageTitle: 'orgs.org.title',
        //   },
        //   canActivate: [UserRouteAccessService],
        // },


        {
          path: 'orglist',
          component: OrglistComponent,
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
          path: 'vulnerability-and-exploit',
          component: CoreVulnerabilityExploitComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.vulnerability-and-exploit.title',
          },
        },
        {
          path: 'threat-actor-malware-and-campaign',
          component: CoreThreatActorMalwareCampaignComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.threat-actor-malware-and-campaign.title',
          },
        },
        {
          path: 'help-and-support',
          component: CoreHelpSupportComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.help-and-support.title',
          },
        },
        {
          path: 'report',
          component: CoreReportComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.report.title',
          },
        },
        {
          path: 'attack-surface',
          component: CoreAttackSurfaceComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.attack-surface.title',
          },
        },
        {
          path: 'digital-risk',
          component: CoreDigitalRiskComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.digital-risk.title',
          },
        },
        {
          path: 'master-scheduler',
          component: CoreMasterSchedulerComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.master-scheduler.title',
          },
        },
        {
          path: 'cloud-weakness',
          component: CoreCloudWeaknessComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.cloud-weakness.title',
          },
        },
        {
          path: 'export-user-data',
          component: CoreExportDataComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.export-user-data.title',
          },
        },
        {
          path: 'surface-web',
          component: CoreSurfaceWebComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.surface-web.title',
          },
        },
        {
          path: 'client-threat-correlation',
          component: CoreClientThreatCorrelationComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.client-threat-correlation.title',
          },
        },
        {
          path: 'lolbas',
          component: CoreLolbasComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.lolbas.title',
          },
        },
        {
          path: 'confidential-file',
          component: CoreConfidentialFileComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.confidential-file.title',
          },
        },
        {
          path: 'piicii',
          component: CorePiiCiiComponent,
          data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cyfirmaweb.piicii.title',
          },
        },
      ],
    },
    {
      path: 'alert-center',
      component: AlertCenterComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.alertPageTitle',
      },
    },
    {
      path: 'news-details',
      component: NewsDetailsComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.newsDetails',
      },
    },
    {
      path: 'news-details/:name',
      component: NewsDetailsComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.newsDetails',
      },
    },
    {
      path: 'early-warnings',
      component: EarlyWarningComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.earlywarning.title',
      },
    },
    {
      path: 'early-warning/:name',
      component: EarlyWarningComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.earlywarning.title',
      },
    },
    {
      path: 'keyword-search',
      component: SearchListComponent,
      canActivate: [UserRouteAccessService],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'global.commons.commonSearch.title',
      },
    },
    {
      path: 'org',
      component: OrgComponent,
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


    
    

    {
      path: 'advance-search',
      component: AdvanceSearchComponent,
      data: {
        pageTitle: 'global.commons.advanceSearch.title',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'advance-search/:id',
      component: AdvanceSearchDetailsComponent,
      data: {
        pageTitle: 'global.commons.advanceSearch.title',
      },
      canActivate: [UserRouteAccessService],
    },
    {
      path: 'domains-report',
      component: CoreDomainsReportComponent,
      // canActivate: [false],
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'cyfirmaweb.domains-report.title',
      },
    },
    {
      path: 'mssp',
      component: MsspDashboardComponent,
      data: {
        pageTitle: 'mssp.pageTitle',
      },
      canActivate: [UserRouteAccessService],
    },
  ],
};
