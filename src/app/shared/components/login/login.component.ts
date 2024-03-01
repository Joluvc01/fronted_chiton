import { Component, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  islogged = this.service.currentUserLoginOn.value;
  myform: FormGroup;

  constructor(
    private router: Router,
    private buildr: FormBuilder,
    private service: AuthService
  ) {
    this.myform = this.buildr.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.myform.valid) {
      const formData = this.myform.value;
      this.service.login(formData).subscribe({
        error: (error) => {
          if (error.error==null){
            Swal.fire({
              title: 'Error',
              text: 'Credenciales Invalidas',
              icon: 'error',
            });
          } else{
            Swal.fire({
              title: 'Error',
              text: error.error,
              icon: 'error',
            });
          }
        },
        complete: () => {
          this.router.navigateByUrl('');
          this.myform.reset();
        },
      });
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return (
      this.myform.get(controlName)?.hasError(errorType) &&
      this.myform.get(controlName)?.touched
    );
  }
}
