import { Component } from '@angular/core';
import { ICategory } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { faPen, faThumbTack, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategorydetailComponent } from './categorydetail/categorydetail.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  categoryList: ICategory[] = [];
  p: number = 1;
  filterName = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;

  constructor(private _apiService: CategoryService, private _router: Router, private dailog: MatDialog) {}

  ngOnInit(): void {
    this.reloadCategoryList();
  }

  reloadCategoryList(): void {
    this._apiService.getAllCategories().subscribe(
      (data) => {
        this.categoryList = data;
      },
      (error) => {
        console.error('Error al cargar la lista de categorías:', error);
      }
    );
  }

  create(){
    this.modal(0, 'Crear Categoria')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Categoria');
    
  }
  status(id: number): void {
    if (id) {
      if (
        confirm(
          '¿Estás seguro de que quieres cambiar el estado de esta categoría?'
        )
      ) {
        this._apiService.setStatus(id).subscribe(
          (response) => {
            console.log(response);
            this.reloadCategoryList();
          },
          (error) => {
            console.error('Error al cambiar el estado de la categoría:', error);
          }
        );
      }
    }
  }

  delete(id: number): void {
    if (id) {
      if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        this._apiService.deleteCategory(id).subscribe(
          (response) => {
            console.log(response);
            this.reloadCategoryList();
          },
          (error) => {
            console.error('Error al eliminar la categoría:', error);
          }
        );
      }
    }
  }

  modal(id: number, title:string){
    var _popup = this.dailog.open(CategorydetailComponent,{
      width: '30%',
      enterAnimationDuration:'500ms',
      exitAnimationDuration:'500ms',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      console.log(item);
      this.reloadCategoryList();
    })
  }
}
