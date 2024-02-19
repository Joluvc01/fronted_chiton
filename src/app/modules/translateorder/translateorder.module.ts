import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateorderRoutingModule } from './translateorder-routing.module';
import { TranslateorderComponent } from './translateorder.component';
import { TranslatedetailComponent } from './translatedetail/translatedetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TranslateorderComponent,
    TranslatedetailComponent
  ],
  imports: [
    CommonModule,
    TranslateorderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule
  ],

  exports:[
    TranslateorderComponent,
    TranslatedetailComponent
  ]
})
export class TranslateorderModule { }
