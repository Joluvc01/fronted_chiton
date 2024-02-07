import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorydetailComponent } from './categorydetail/categorydetail.component';
import { CategoryComponent } from './category.component';

const routes: Routes = [
  { path: '', component: CategoryComponent }, // Ruta para mostrar la lista de categorías
  { path: ':id', component: CategorydetailComponent, pathMatch: 'full'}, // Ruta para mostrar detalles de una categoría por ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
