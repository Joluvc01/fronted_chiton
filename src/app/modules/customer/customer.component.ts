import { Component, OnInit } from '@angular/core';
import { ICustomer } from 'src/app/core/models/customer.model';
import { MatDialog } from '@angular/material/dialog';
import { faPen, faThumbTack, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { CustomerdetailComponent } from './customerdetail/customerdetail.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{
  customers: ICustomer[] = [];
  p: number = 1;
  filterName = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;

  constructor(
    private service: CustomerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
      this.reloadCustomerList();
  }

  reloadCustomerList(): void{
    this.service.getAllCustomers().subscribe(
      (data) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error al cargar la lista de clientes:', error)
      }
    );
  }

  modal(id: number, title:string){
    var _popup = this.dialog.open(CustomerdetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadCustomerList();
    })
  }

  create(){
    this.modal(0, 'Crear Cliente')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Cliente');
  }
  
  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres cambiar el estado de este cliente?",
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
              this.reloadCustomerList();
            },
            (error) => {
              console.error('Error al cambiar el estado del cliente:', error);
            }
          );
        }
      });
    }
  }
  

  delete(id: number): void {
    if (id) {
      Swal.fire({
        title: "Esta seguro de eliminar este cliente?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminalo",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteCustomer(id).subscribe(
            (response) => {
              Swal.fire({
                title: "El cliente fue eliminado!",
                icon: "success"
              });
              this.reloadCustomerList();
              console.log(response);
            },
            (error) => {
              console.error("Error object:", error);
              let errorMessage = JSON.parse(error.error);
              console.log(errorMessage);
              
              let op = errorMessage.OP.join(", ");
              
              let errorText = "";
              if (op) {
                  errorText += "<br>ID Ordenes de produccion asociadas:" + op;
              }
          
              Swal.fire({
                  title: "Se produjo un error al eliminar el cliente",
                  html: errorText,
                  icon: "error"
              });
          }
          
          );
        }
      })
    }
  }
  
}
