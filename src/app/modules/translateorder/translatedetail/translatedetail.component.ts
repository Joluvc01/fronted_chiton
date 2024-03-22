import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProductionOrder } from 'src/app/core/models/productionorder.model';
import { ITranslateOrder } from 'src/app/core/models/translateorder.model';
import { ProductionorderService } from 'src/app/shared/services/productionorder.service';
import { TranslateorderService } from 'src/app/shared/services/translateorder.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-translatedetail',
  templateUrl: './translatedetail.component.html',
  styleUrls: ['./translatedetail.component.css']
})
export class TranslatedetailComponent {
  myform: FormGroup;
  translate: ITranslateOrder | null = null;
  inputdata: any;
  op: number[] = [];
  filteredOps: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<TranslatedetailComponent>,
    private buildr: FormBuilder,
    private service: TranslateorderService,
    private opservice: ProductionorderService,
  ) {
    this.myform = this.buildr.group({
      productionOrder: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listOps();
    this.inputdata = this.data;
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  listOps(): void{
    this.opservice.getAllOp().subscribe(
      (op: IProductionOrder[]) => {
        this.op = op
        .filter(op => op.status === 'Completo' && op.translateOrder === null)
        .map(op => op.id);
        this.filteredOps = this.op;
      },
      error => {
        console.error('Error al obtener las Ordenes de Produccion:', error);
      }
    );
  }

  filterOps(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (!inputElement) {
      return;
    }
  
    const searchTerm = inputElement.value.trim();
    if (!searchTerm) {
      this.filteredOps = this.op;
      return;
    }
  
    this.filteredOps = this.op.filter(op =>
      op.toString().includes(searchTerm)
    );
  }

  setdata(id: number): void {
    this.service.getTranslateById(id).subscribe((translate: ITranslateOrder) => {
      this.translate = translate;
      this.myform.patchValue({
        productionOrder: translate.productionOrder
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
      const action = this.service.newTranslate(formData);
      
      action.subscribe(
        (res) => {
          console.log('Orden de traslado guardada exitosamente:', res);
          this.closepopup();
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
    } else {
      console.log('El formulario no es válido.');
    }
  }
}
