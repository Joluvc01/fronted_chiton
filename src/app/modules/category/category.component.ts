import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { faPen, faThumbTack, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { CategorydetailComponent } from './categorydetail/categorydetail.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit{
  categories: ICategory[] = [];
  p: number = 1;
  filterName = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;

  constructor(
    private service: CategoryService, 
    private dailog: MatDialog
    ) {}

  ngOnInit(): void {
    this.reloadCategoryList();
  }

  reloadCategoryList(): void {
    this.service.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al cargar la lista de categorías:', error);
      }
    );
  }

  modal(id: number, title:string){
    var _popup = this.dailog.open(CategorydetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadCategoryList();
    })
  }

  create(){
    this.modal(0, 'Crear Categoria')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Categoria');
    
  }
  
  
  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres cambiar el estado de esta categoría?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.setStatus(id).subscribe(
            (response) => {
              Swal.fire({
                title: response,
                icon: "success"
              });
              console.log(response);
              this.reloadCategoryList();
            },
            (error) => {
              console.error('Error al cambiar el estado de la categoría:', error);
            }
          );
        }
      });
    }
  }
  

  delete(id: number): void {
    if (id) {
      Swal.fire({
        title: "Esta seguro de eliminar esta categoria?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteCategory(id).subscribe(
            (response) => {
              Swal.fire({
                title: "La categoria fue eliminada!",
                icon: "success"
              });
              this.reloadCategoryList();
              console.log(response);
            },
            (error) => {
              console.error(error);
              const errorMessage = error.error;
              Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error"
              });
            }
            
          );
        }
      })
    }
  }

  
}


