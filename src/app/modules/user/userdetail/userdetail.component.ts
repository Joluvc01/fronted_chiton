import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { IUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit{
  myform: FormGroup;
  user: IUser | null = null;
  inputdata: any;
  username: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UserdetailComponent>,
    private buildr: FormBuilder,
    private service: UserService,
  ) {
    this.myform = this.buildr.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required], [this.userExistValidator(this.service)]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.id > 0) {
      this.setdata(this.inputdata.id);
    }
  }

  setdata(id: number): void {
    this.service.getUserById(id).subscribe((user: IUser) => {
      this.user = user;
      this.username = user.username
      this.myform.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        role: user.role,
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
      const action = this.service.updateUser(id, formData);
      
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