import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavigatorModule } from '../layouts/navigator/navigator.module';
import { PaginationModule } from '../layouts/pagination/pagination.module';
import { CyfirmawebSharedModule, AngularMaterialModule } from '../shared';
import { OrgComponent, OrgService, OrgRoute, OrgDialogComponent, OrgResolvePagingParams, OrgAnalystService } from './';
import { OrgDetailsComponent } from './org-details/org-details.component';
import { NavigatorComponent } from '../layouts/navigator/navigator.component';
import { CPaginationComponent } from '../layouts/pagination/pagination.component';
import { CKEditorModule } from 'ng2-ckeditor';
// import { TranslateModule } from '@ngx-translate/core';
import {
  OrgDetailsService,
  OrgAssetsService,
  OrgAssetsTempService,
  OrgUserService,
  RoleService,
  PermissionService,
  OrgReportFrequencyService,
  OrgReportRecipientService,
  OrgSubscriptionService,
  OrgReportConfigService,
  OrgSubscriptionAuditService,
} from './org-details-service';

const ENTRY_STATES = [...OrgRoute];

@NgModule({
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CyfirmawebSharedModule,
    AngularMaterialModule,
    NavigatorModule,
    PaginationModule,
    // TranslateModule,
    RouterModule.forChild([]),
  ],
  declarations: [OrgComponent, OrgDialogComponent, OrgDetailsComponent],
  entryComponents: [OrgComponent, OrgDialogComponent, NavigatorComponent, CPaginationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    OrgService,
    OrgResolvePagingParams,
    OrgDetailsService,
    OrgAnalystService,
    OrgAssetsService,
    OrgAssetsTempService,
    OrgUserService,
    RoleService,
    PermissionService,
    OrgReportFrequencyService,
    OrgReportRecipientService,
    OrgSubscriptionService,
    OrgReportConfigService,
    OrgSubscriptionAuditService,
  ],
})
export class OrgModule {}
