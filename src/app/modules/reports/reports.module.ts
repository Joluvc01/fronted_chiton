import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Utils } from 'src/app/shared/utils/utils';


@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgxPaginationModule,
  ],
  providers: [
    Utils
  ]
})
export class ReportsModule { }
