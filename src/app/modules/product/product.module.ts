import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ProductComponent } from './product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ProductComponent,
    ProductdetailComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule,
  ],

  exports:[
    ProductComponent,
    ProductdetailComponent,
  ]
})
export class ProductModule { }
