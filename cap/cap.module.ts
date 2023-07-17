import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CapComponent, CAP_ROUTE } from './';
import { NewsDetailsComponent } from '../shared/components/new-details/news-details.component';

import { AngularMaterialModule, CyfirmawebSharedModule } from '../shared';
import { CyberThreatModule } from '../cyber-threat/cyber-threat.module';
import { TviModule } from '../modules/tvi/tvi.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CapService } from './cap.service';
// import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    CyfirmawebSharedModule,
    CyberThreatModule,
    TviModule,
    FormsModule,
    BrowserAnimationsModule,
    // TranslateModule,
    RouterModule.forChild([CAP_ROUTE]),
  ],
  declarations: [CapComponent, NewsDetailsComponent],
  entryComponents: [],
  providers: [TitleCasePipe, CapService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CapModule {}
