import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';

const routes: Routes = [

  { path: 'categories', 
  loadChildren: () => import(`./modules/category/category.module`).then(m => m.CategoryModule)},

  { path: 'products',
  loadChildren: () => import(`./modules/product/product.module`).then(m =>m.ProductModule)},

  { path: 'purchases',
  loadChildren: () => import(`./modules/purchaseorder/purchaseorder.module`).then(m =>m.PurchaseorderModule)},

  { path: 'references',
  loadChildren: () => import(`./modules/reference/reference.module`).then(m=>m.ReferenceModule)},

  { path: 'customers',
  loadChildren: () => import(`./modules/customer/customer.module`).then(m=>m.CustomerModule)},

  { path: 'productionOrders',
  loadChildren: () => import(`./modules/productionorder/productionorder.module`).then(m=>m.ProductionorderModule)},

  { path: 'translateOrders',
  loadChildren: () => import(`./modules/translateorder/translateorder.module`).then(m=>m.TranslateorderModule)},

  { path: 'users',
  loadChildren: () => import(`./modules/user/user.module`).then(m=>m.UserModule)},

  { path: 'reports',
  loadChildren: () => import(`./modules/reports/reports.module`).then(m=>m.ReportsModule)},

  { path: '', component: HomeComponent},

  { path: 'login', component: LoginComponent},

  { path: 'error', component: ErrorPageComponent },
  
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
