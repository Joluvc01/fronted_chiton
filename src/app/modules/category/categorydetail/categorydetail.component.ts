import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from 'src/app/core/models/category.model';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-categorydetail',
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.css'],
})
export class CategorydetailComponent implements OnInit {
  formCategory: FormGroup;
  category: ICategory | null = null;
  allCategories: ICategory[] = [];
  isEditMode: boolean = false;
  loading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _apiService: CategoryService,
    private _router: Router
  ) {
    this.formCategory = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this._route.params.subscribe((params) => {
      const categoryId = params['id'];
      if (!categoryId) {
        this._router.navigate(['/error']); // Si no hay ID en la ruta, redirige a la página de error
        return;
      }
      if (categoryId === 'new') {
        this.isEditMode = false;
        // Lógica para cargar métodos cuando se crea una nueva categoría
      } else if (isNaN(+categoryId)) {
        // Si categoryId no es un número, significa que no es una ruta válida
        this._router.navigate(['/error']); // Redirige a la página de error
      } else {
        // Llamar al servicio para obtener los detalles de la categoría
        this._apiService.getCategoryById(categoryId).subscribe(
          (category: ICategory) => {
            this.category = category;
            this.isEditMode = true;
            this.formCategory.patchValue({
              name: category.name});
          },
          (error) => {
            if (error.status === 404) {
              console.log(`Categoria con ID ${categoryId} no existe`);
            } else {
              console.error('Error:', error);
              this._router.navigate(['/error']); // Redirige a la página de error en caso de otro error
            }
          }
        );
      }
    });
  }

  getAllCategories(): void {
    this._apiService.getAllCategories().subscribe((categories: ICategory[]) => {
      this.allCategories = categories;
    });
  }

  checkIfNameExists(name: string): boolean {
    return this.allCategories.some((category) => category.name === name);
  }

  hasErrors(controlName: string, errorType: string): boolean {
    const control = this.formCategory.get(controlName);
    if (control) {
      if (errorType === 'exists') {
        const nameValue = control.value.trim();
        return this.checkIfNameExists(nameValue);
      } else {
        return control.hasError(errorType) && control.touched;
      }
    }
    return false;
  }

  enviar(): void {
    if (this.formCategory.valid) {
      const formData = this.formCategory.value;
      if (this.isEditMode) {
        // Editar categoría existente
        this._apiService
          .updateCategory(Number(this.category?.id), formData)
          .subscribe(
            (response) => {
              console.log('Categoria Actualizada:', response);
              this._router.navigate(['/categories']);
            },
            (error) => {
              console.error('Error al enviar formulario:', error);
              // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
            }
          );
      } else {
        // Crear nueva categoría
        this._apiService.newCategory(formData).subscribe(
          (response) => {
            console.log('Nueva categoría creada:', response);
            this._router.navigate(['/categories']);
          },
          (error) => {
            console.error('Error al crear categoría:', error);
            // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
          }
        );
      }
    } else {
      console.log('El formulario no es válido.');
    }
  }

  eliminarCategoria(): void {
    if (this.category) {
      if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        this._apiService.deleteCategory(this.category.id).subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response); // Aquí puedes ver el mensaje de éxito del servidor
            console.log('Categoría eliminada exitosamente.');
            this._router.navigate(['/categories']);
          },
          (error) => {
            console.error('Error al eliminar la categoría:', error);
            // Manejar el error, mostrar un mensaje de error, etc.
          }
        );
      }
    }
  }

  status(): void {
    if (this.category) {
      if (confirm('¿Estás seguro de que quieres cambiar el estado de esta categoría?')) {
        this._apiService.setStatus(this.category.id).subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response);
            console.log('Cambio de estado exitoso.');
            this._router.navigate(['/categories']);
          },
          (error) => {
            console.error('Error al cambiar el estado de la categoría:', error);
            // Manejar el error, mostrar un mensaje de error, etc.
          }
        );
      }
    }
  }
  

}
