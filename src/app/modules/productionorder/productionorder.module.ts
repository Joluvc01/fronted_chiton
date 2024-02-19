import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionorderRoutingModule } from './productionorder-routing.module';
import { ProductionorderComponent } from './productionorder.component';
import { ProductiondetailComponent } from './productiondetail/productiondetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductionorderComponent,
    ProductiondetailComponent
  ],
  imports: [
    CommonModule,
    ProductionorderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule
  ],

  exports:[
    ProductionorderComponent,
    ProductiondetailComponent
  ]
})
export class ProductionorderModule { }
