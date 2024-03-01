import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseorderComponent } from './purchaseorder.component';

const routes: Routes = [
  { path: '', component: PurchaseorderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseorderRoutingModule { }
