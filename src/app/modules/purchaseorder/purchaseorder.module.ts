import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseorderRoutingModule } from './purchaseorder-routing.module';
import { PurchaseorderComponent } from './purchaseorder.component';


@NgModule({
  declarations: [
    PurchaseorderComponent
  ],
  imports: [
    CommonModule,
    PurchaseorderRoutingModule
  ]
})
export class PurchaseorderModule { }
