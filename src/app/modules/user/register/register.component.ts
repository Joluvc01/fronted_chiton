import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { IRegister } from 'src/app/core/models/register.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  myform: FormGroup;
  user: IRegister | null = null;
  inputdata: any;
  username: string = '';
  hidePassword: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<RegisterComponent>,
    private buildr: FormBuilder,
    private service: UserService,
  ) {
    this.myform = this.buildr.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required], [this.userExistValidator(this.service)]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit(): void {
    this.inputdata = this.data;
  }

  closepopup(): void {
    this.ref.close();
  }

  save(): void {
    if (this.myform.valid) {
      const formData = this.myform.value;
      const action = this.service.newUser(formData);
      
      action.subscribe(
        (res) => {
          console.log('Usuario guardado exitosamente:', res);
          this.closepopup();
        },
        (error) => {
          console.error('Error al guardar el Usuario:', error);
        }
      );
    } else {
      console.log('El formulario no es válido.');
    }
  }

  userExistValidator(service: UserService): ValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const originalName = this.username;
      const name = control.value;
  
      if (name === originalName) {
        return of(null);
      }
  
      if (!name) {
        return of(null);
      }
  
      return service.checkUserExists(name).pipe(
        map(exists => exists ? { nameExists: true } : null)
      );
    };
  }
}