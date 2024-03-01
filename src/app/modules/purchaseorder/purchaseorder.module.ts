import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseorderRoutingModule } from './purchaseorder-routing.module';
import { PurchaseorderComponent } from './purchaseorder.component';
import { PurchasedetailComponent } from './purchasedetail/purchasedetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PurchaseorderComponent,
    PurchasedetailComponent,
  ],
  imports: [
    CommonModule,
    PurchaseorderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule
  ],

  exports:[
    PurchaseorderComponent,
    PurchasedetailComponent
  ]
})
export class PurchaseorderModule { }
