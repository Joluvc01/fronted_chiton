import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ProductComponent } from './product.component';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    ProductComponent,
    ProductdetailComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    MaterialModule
  ],

  exports:[
    ProductComponent,
    ProductdetailComponent,
  ]
})
export class ProductModule { }
