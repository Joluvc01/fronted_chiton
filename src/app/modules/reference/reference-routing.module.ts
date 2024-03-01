import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceComponent } from './reference.component';
import { ImageviewerComponent } from './imageviewer/imageviewer.component';

const routes: Routes = [
  { path: '', component: ReferenceComponent},
  { path: 'image/:id', component: ImageviewerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceRoutingModule { }
