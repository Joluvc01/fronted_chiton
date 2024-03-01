import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionorderComponent } from './productionorder.component';

const routes: Routes = [
  { path: '', component: ProductionorderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionorderRoutingModule { }
