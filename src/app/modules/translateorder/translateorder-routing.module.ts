import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateorderComponent } from './translateorder.component';

const routes: Routes = [
  { path: '', component: TranslateorderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslateorderRoutingModule { }
