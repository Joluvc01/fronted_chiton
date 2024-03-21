import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { ICustomer } from 'src/app/core/models/customer.model';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.css']
})
export class CustomerdetailComponent {
  myform: FormGroup;
  customer: ICustomer | null = null;
  inputdata: any; 
  custsave: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CustomerdetailComponent>,
    private buildr: FormBuilder,
    private service: CustomerService,
  ) {
    this.myform = this.buildr.group({
      name: ['', [Validators.required], this.nameExistValidator(this.service)],
      ruc: ['', [this.numberLengthValidator(11)] ],
      contactNumber: ['', [Validators.required, this.numberLengthValidator(9)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  setdata(id: number): void {
    this.service.getCustomerById(id).subscribe((customer: ICustomer) => {
      this.customer = customer,
      this.custsave = customer.name,
      this.myform.patchValue({
        name: customer.name,
        ruc: customer.ruc,
        contactNumber: customer.contactNumber,
        email: customer.email
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
      const action = id > 0 ? this.service.updateCustomer(id, formData) : this.service.newCustomer(formData);
      
      action.subscribe(
        (res) => {
          console.log('Cliente guardado exitosamente:', res);
          this.closepopup();
        },
        (error) => {
          console.error('Error al guardar el cliente:', error);
        }
      );
    } else {
      console.log('El formulario no es válido.');
    }
  }

  nameExistValidator(service: CustomerService): ValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const originalName = this.custsave;
      const name = control.value;
  
      if (name === originalName) {
        return of(null);
      }
  
      if (!name) {
        return of(null);
      }
  
      return service.checkCustomerExists(name).pipe(
        map(exists => exists ? { nameExists: true } : null)
      );
    };
  }

  numberLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      
      if (isNaN(value) || value.toString().length !== length) {
        return { 'numberLength': { value: control.value } };
      }
  
      return null; 
    }
}
}

