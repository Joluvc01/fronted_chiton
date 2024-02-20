import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NoAuthGuard } from './core/guards/auth\'nt.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [

  { path: 'categories', canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'ALMACEN']},
  loadChildren: () => import(`./modules/category/category.module`).then(m => m.CategoryModule)},

  { path: 'products',  canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'ALMACEN', 'PRODUCCION', 'DISENIO']},
  loadChildren: () => import(`./modules/product/product.module`).then(m =>m.ProductModule)},

  { path: 'purchases', canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'ALMACEN']},
  loadChildren: () => import(`./modules/purchaseorder/purchaseorder.module`).then(m =>m.PurchaseorderModule)},

  { path: 'references', canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'PRODUCCION', 'DISENIO']},
  loadChildren: () => import(`./modules/reference/reference.module`).then(m=>m.ReferenceModule)},

  { path: 'customers', canActivate: [RoleGuard], data: { roles: ['GERENCIA']},
  loadChildren: () => import(`./modules/customer/customer.module`).then(m=>m.CustomerModule)},

  { path: 'productionOrders', canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'PRODUCCION']},
  loadChildren: () => import(`./modules/productionorder/productionorder.module`).then(m=>m.ProductionorderModule)},

  { path: 'translateOrders', canActivate: [RoleGuard], data: { roles: ['GERENCIA', 'PRODUCCION']},
  loadChildren: () => import(`./modules/translateorder/translateorder.module`).then(m=>m.TranslateorderModule)},

  { path: 'users', canActivate: [RoleGuard], data: { roles: ['GERENCIA']},
  loadChildren: () => import(`./modules/user/user.module`).then(m=>m.UserModule)},

  { path: 'reports', canActivate: [RoleGuard], data: { roles: ['GERENCIA']},
  loadChildren: () => import(`./modules/reports/reports.module`).then(m=>m.ReportsModule)},

  { path: '', component: HomeComponent, canActivate: [RoleGuard], data: { roles: []}},

  { path: 'login', component: LoginComponent, canActivate:[NoAuthGuard]},

  { path: 'error', component: ErrorPageComponent, canActivate: [RoleGuard], data: { roles: []}},
  
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
