import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

const routes: Routes = [

  { path: 'categories', 
  loadChildren: () => import(`./modules/category/category.module`).then(m => m.CategoryModule)},
  { path: 'products',
  loadChildren: () => import(`./modules/product/product.module`).then(m =>m.ProductModule)},
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
