import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategory } from 'src/app/core/models/category.model';
import { IProduct } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit{

  myform: FormGroup;
  product: IProduct | null = null;
  inputdata: any;
  categories: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ProductdetailComponent>,
    private buildr: FormBuilder,
    private service: ProductService,
    private catservice: CategoryService,
  ) {
    this.myform = this.buildr.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      color: ['',[Validators. required]],
      stock: [0,[Validators.required, Validators.min(1), notAllowed(/^0/)]],
    });
  }
  ngOnInit(): void {
    this.inputdata = this.data;
    this.listcategories();
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  listcategories(): void {
    this.catservice.getAllCategories().subscribe(
      (categories: ICategory[]) => {
        this.categories = categories.map(category => category.name);
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }


  setdata(id: number): void {
    this.service.getProductById(id).subscribe((product: IProduct) =>{
      this.product = product;
      this.myform.patchValue({
        name: product.name,
        category: product.category,
        color: product.color,
        stock: product.stock
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
      const action = id > 0 ? this.service.updateProduct(id, formData) : this.service.newProduct(formData);
      
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

  function notAllowed(input: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Permitir valores vacíos, ya que Validators.required se encarga de esto
    }

    if (typeof value === 'string' && input.test(value)) {
      return { notAllowed: { value: control.value } };
    }

    if (typeof value === 'number' && value <= 0) {
      return { notAllowed: { value: control.value } };
    }

    return null;
  };
}
