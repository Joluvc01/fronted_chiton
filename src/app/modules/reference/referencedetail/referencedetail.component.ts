import { Component, Inject } from '@angular/core';
import { IReference } from 'src/app/core/models/reference.model';
import { faMinus} from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReferenceService } from 'src/app/shared/services/reference.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-referencedetail',
  templateUrl: './referencedetail.component.html',
  styleUrls: ['./referencedetail.component.css']
})
export class ReferencedetailComponent {

  myform: FormGroup;
  reference: IReference | null = null;
  inputdata: any;
  products: string[] = [];
  faMinus = faMinus;
  public image: any = [];

  get details(){
    return this.myform.get('details') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ReferencedetailComponent>,
    private buildr: FormBuilder,
    private service: ReferenceService,
    private prodservice: ProductService,
  ) {
    this.myform = this.buildr.group({
      description: ['', [Validators.required]],
      image: [''],
      details : this.buildr.array([this.initform()])
    });
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    this.listproducts();
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  initform(): FormGroup {
    return this.buildr.group({
      product: '',
      quantity: ''
    });
  }

  addfield() {
    const detailformgroup = this.buildr.group({
      product: '',
      quantity: ''
    });
    this.details.push(detailformgroup);
    
  }

  delfield(index: number){
    this.details.removeAt(index);
  }

  listproducts(): void {
    this.prodservice.getAllProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products
          .filter(product => product.status === 'Activado')
          .map(product => product.name);
      },
      error => {
        console.error('Error al obtener los productos: ', error);
      }
    );
  }

  setdata(id: number): void {
    this.service.getReferenceById(id).subscribe((reference: IReference) => {
      this.reference = reference;
      const detailsFormArray = this.myform.get('details') as FormArray;
      
      while (detailsFormArray.length) {
        detailsFormArray.removeAt(0);
      }

      this.myform.patchValue({
        description: reference.description
      })
      
      reference.details.forEach(detail => {
        detailsFormArray.push(this.buildr.group({
          product: detail.product,
          quantity: detail.quantity
        }));
      });
    });
  }

  closepopup(): void {
    this.ref.close();
  }

  save(): void{
    if(this.myform.valid) {
      const formData = this.myform.value;
      const id = this.inputdata.id;
      const action = id > 0 ? this.service.updateReferences(id, formData) : this.service.newReferences(formData);

      action.subscribe(
        (res) => {
          const id = res.id
          this.uploadimage(id);
          console.log('Orden de compra guardada exitosamente:', res);
          this.closepopup();
        },
        (error) => {
          console.error('Error al guarda orden de compra:', error);
        }
      );
    } else {
      console.log('El formulario no es valido.');
    }
  }
  
  catchfile(event: any): void{
    const image = event.target.files[0]
    this.image.push(image);
  }

  uploadimage(id: number): any{
      const formData = new FormData();
      this.image.forEach((archivo: string | Blob) => {
        formData.append('files', archivo)
      })
      
      this.service.uploadImage(id, this.image[0]).subscribe(res =>{
        console.log(res);
      })
    }
}

