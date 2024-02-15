import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CategorydetailComponent } from './categorydetail/categorydetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [
    CategoryComponent,
    CategorydetailComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    MaterialModule
  ],

  exports:[
    CategoryComponent,
    CategorydetailComponent,
  ]
})
export class CategoryModule { }
