import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

const routes: Routes = [

  {path: 'categories', 
  loadChildren: () => import(`./modules/category/category.module`).then(m => m.CategoryModule)},
  { path: 'error', component: ErrorPageComponent }, // Ruta para mostrar la página de error
  { path: '**', redirectTo: 'error' } // Ruta comodín para cualquier otra ruta no reconocida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
