import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    UserComponent,
    UserdetailComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    SharedModule
  ],
  exports:[
    UserComponent,
    UserdetailComponent
  ]
})
export class UserModule { }
