import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ICategory } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-categorydetail',
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.css'],
})
export class CategorydetailComponent implements OnInit {

  myform: FormGroup;
  category: ICategory | null = null;
  inputdata: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CategorydetailComponent>,
    private buildr: FormBuilder,
    private service: CategoryService,
  ) {
    this.myform = this.buildr.group({
      name: ['', [Validators.required], nameExistValidator(this.service)]
    });
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  setdata(id: number): void {
    this.service.getCategoryById(id).subscribe((category: ICategory) => {
      this.category = category;
      this.myform.patchValue({
        name: category.name
      });
    });
  }

  closepopup(): void {
    this.ref.close();
  }

  save(): void {
    if (this.myform.valid) {
      const formData = this.myform.value;
      const id = this.inputdata.id;
      const action = id > 0 ? this.service.updateCategory(id, formData) : this.service.newCategory(formData);
      
      action.subscribe(
        (res) => {
          console.log('Categoría guardada exitosamente:', res);
          this.closepopup();
        },
        (error) => {
          console.error('Error al guardar la categoría:', error);
        }
      );
    } else {
      console.log('El formulario no es válido.');
    }
  }
}

function nameExistValidator(service: CategoryService): ValidatorFn {
  return (control: AbstractControl) => {
    const name = control.value;
    if (!name) {
      return null;
    }

    return service.checkCategoryExists(name).pipe(
      map(exists => exists ? { nameExists: true } : null)
    );
  };
}
