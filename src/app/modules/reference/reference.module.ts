import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferenceRoutingModule } from './reference-routing.module';
import { ReferenceComponent } from './reference.component';
import { ReferencedetailComponent } from './referencedetail/referencedetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageviewerComponent } from './imageviewer/imageviewer.component';


@NgModule({
  declarations: [
    ReferenceComponent,
    ReferencedetailComponent,
    ImageviewerComponent
  ],
  imports: [
    CommonModule,
    ReferenceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule
  ],

  exports:[
    ReferenceComponent,
    ReferencedetailComponent,
    ImageviewerComponent
  ]
})
export class ReferenceModule { }
