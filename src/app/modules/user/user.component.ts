import { Component, OnInit } from '@angular/core';
import { faPen, faThumbTack, faTrash, faKey} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { IUser } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  users: IUser[] = [];
  p: number = 1;
  filterId = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;
  faKey = faKey;

  constructor(
    private service: UserService, 
    private dailog: MatDialog
    ) {}

  ngOnInit(): void {
    this.reloadUserList();
  }

  reloadUserList(): void {
    this.service.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al cargar la lista de usuarios:', error);
      }
    );
  }

  modal(id: number, title:string){
    var _popup;
    if (id>0){
      _popup = this.dailog.open(UserdetailComponent,{
        width: '30%',
        data:{
          title: title,
          id: id
        }
      })
    } else {
      _popup = this.dailog.open(RegisterComponent,{
        width: '30%',
        data:{
          title: title,
          id: id
        }
      })
    }
    _popup.afterClosed().subscribe(item =>{    
      this.reloadUserList();
    })
  }

  create(){
    this.modal(0, 'Crear Usuario')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Usuario');
    
  }

  changePassword(id: number): void {
    Swal.fire({
      title: 'Cambiar Contraseña',
      input: 'password',
      inputPlaceholder: 'Ingrese la nueva contraseña',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      inputAttributes: {
        autocomplete: 'new-password',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'La contraseña es obligatoria';
        }
        return null; // Devuelve null si la validación pasa
      },
      preConfirm: (newPassword) => {
        return this.service.changePassword(id, newPassword);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Éxito',
          text: 'Contraseña cambiada exitosamente',
          icon: 'success'
        });
        this.reloadUserList();
      }
    }).catch((error) => {
      console.error('Error al cambiar la contraseña:', error);
      Swal.fire({
        title: 'Error',
        text: error.error,
        icon: 'error'
      });
    });
  }
  
  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres cambiar el estado de este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.setStatus(id).subscribe(
            (response) => {
              Swal.fire({
                title: response,
                icon: "success"
              });
              console.log(response);
              this.reloadUserList();
            },
            (error) => {
              console.error('Error al cambiar el estado del usuario:', error);
            }
          );
        }
      });
    }
  }
  

  delete(id: number): void {
    if (id) {
      Swal.fire({
        title: "Esta seguro de eliminar este usuario?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteUser(id).subscribe(
            (response) => {
              Swal.fire({
                title: "El usuario fue eliminada!",
                icon: "success"
              });
              this.reloadUserList();
              console.log(response);
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
        }
      })
    }
  }
}
