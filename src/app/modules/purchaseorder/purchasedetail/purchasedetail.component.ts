import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from 'src/app/core/models/product.model';
import { faMinus} from '@fortawesome/free-solid-svg-icons';
import { IPurchaseOrder } from 'src/app/core/models/purchaseorder.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { PurchaseorderService } from 'src/app/shared/services/purchaseorder.service';

@Component({
  selector: 'app-purchasedetail',
  templateUrl: './purchasedetail.component.html',
  styleUrls: ['./purchasedetail.component.css']
})
export class PurchasedetailComponent implements OnInit{

  myform: FormGroup;
  purchase: IPurchaseOrder | null = null;
  inputdata: any;
  products: string[] = [];
  faMinus = faMinus;

  get details(){
    return this.myform.get('details') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PurchasedetailComponent>,
    private buildr: FormBuilder,
    private service: PurchaseorderService,
    private prodservice: ProductService,
  ) {
    this.myform = this.buildr.group({
      details : this.buildr.array([this.initform()])
    })
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
        // Filtrar los productos con estado 'Activado' y guardar solo los nombres
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
    this.service.getPurchaseOrderById(id).subscribe((purchase: IPurchaseOrder) => {
      this.purchase = purchase;
      const detailsFormArray = this.myform.get('details') as FormArray;
      
      while (detailsFormArray.length) {
        detailsFormArray.removeAt(0);
      }
      
      purchase.details.forEach(detail => {
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
      const action = id > 0 ? this.service.updatePurchaseOrders(id, formData) : this.service.newPurchaseOrders(formData);

      action.subscribe(
        (res) => {
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
}
