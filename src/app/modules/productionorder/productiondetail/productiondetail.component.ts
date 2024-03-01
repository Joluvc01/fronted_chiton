import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faMinus} from '@fortawesome/free-solid-svg-icons';
import { ICustomer } from 'src/app/core/models/customer.model';
import { IProductionOrder } from 'src/app/core/models/productionorder.model';
import { IReference } from 'src/app/core/models/reference.model';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ProductionorderService } from 'src/app/shared/services/productionorder.service';
import { ReferenceService } from 'src/app/shared/services/reference.service';


@Component({
  selector: 'app-productiondetail',
  templateUrl: './productiondetail.component.html',
  styleUrls: ['./productiondetail.component.css']
})
export class ProductiondetailComponent implements OnInit{
  myform: FormGroup;
  prod: IProductionOrder | null = null;
  inputdata: any;
  references: number[] = [];
  filteredReferences: number[] =[];
  customers: string[]= [];
  filteredCustomers: string[] = [];
  faMinus = faMinus;
  selectedDate: Date | null = null;

  get details(){
    return this.myform.get('details') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ProductiondetailComponent>,
    private buildr: FormBuilder,
    private service: ProductionorderService,
    private refservice: ReferenceService,
    private custservice: CustomerService,
  ) {
    this.myform = this.buildr.group({
      customer: ['',[Validators.required]],
      deadline:['', [Validators.required, this.dateNotPastValidator()]],
      details : this.buildr.array([this.initform()])
    })
  }
  ngOnInit(): void {
    this.inputdata = this.data;
    this.listreferences();
    this.listcustomers();
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  initform(): FormGroup {
    return this.buildr.group({
      reference: '',
      quantity: ['1', this.notAllowed(/^0/)]
    });
  }

  addfield() {
    const detailformgroup = this.buildr.group({
      reference: '',
      quantity: ['1', this.notAllowed(/^0/)]
    });
    this.details.push(detailformgroup); 
  }

  delfield(index: number){
    this.details.removeAt(index);
  }

  listreferences(): void {
    this.refservice.getAllReferences().subscribe(
      (refs: IReference[]) => {
        this.references = refs
          .filter(reference => reference.status === 'Activado')
          .map(reference => reference.id);
          this.filteredReferences = this.references;
      },
      error => {
        console.error('Error al obtener las referencias: ', error);
      }
    );
  }
  

  filterRefs(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (!inputElement) {
      return;
    }
  
    const searchTerm = inputElement.value.trim();
    if (!searchTerm) {
      this.filteredReferences = this.references;
      return;
    }
  
    this.filteredReferences = this.references.filter(ref =>
      ref.toString().includes(searchTerm)
    );
  }

  listcustomers(): void {
    this.custservice.getAllCustomers().subscribe(
      (customers: ICustomer[]) => {
        this.customers = customers
          .filter(customers => customers.status === 'Activado')
          .map(customers => customers.name);
          this.filteredCustomers = this.customers
      },
      error => {
        console.error('Error al obtener los clientes: ', error);
      }
    );
  }
  
  filterCustomers(event: any): void {
    const inputElement = event?.target as HTMLInputElement;
    if (!inputElement) {
      return;
    }
  
    const searchTerm = inputElement.value.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredCustomers = this.customers;
      return;
    }
  
    this.filteredCustomers = this.customers.filter(customer =>
      customer.toLowerCase().includes(searchTerm)
    );
  }


  setdata(id: number): void {
    this.service.getOpById(id).subscribe((prod: IProductionOrder) => {
      this.prod = prod;
      const detailsFormArray = this.myform.get('details') as FormArray;
      
      while (detailsFormArray.length) {
        detailsFormArray.removeAt(0);
      }

      this.myform.patchValue({
        customer: prod.customer,
        deadline: prod.deadline,
      })
      
      prod.details.forEach(detail => {
        detailsFormArray.push(this.buildr.group({
          reference: detail.reference,
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
      const action = id > 0 ? this.service.updateOp(id, formData) : this.service.newOp(formData);
      console.log(formData);
      
      action.subscribe(
        (res) => {
          console.log('Orden de produccion guardada exitosamente:', res);
          this.closepopup();
        },
        (error) => {
          console.error('Error al guarda orden de produccion:', error);
        }
      );
    } else {
      console.log('El formulario no es valido.');
    }
  }

  notAllowed(input: RegExp): ValidatorFn {
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

  dateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = control.value;
      const currentDate = new Date();
  
      if (selectedDate && selectedDate < currentDate) {
        return { 'dateNotPast': { value: selectedDate } };
      }
  
      return null;
    };
}
}
