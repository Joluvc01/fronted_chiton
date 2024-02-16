import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/core/models/product.model';
import { faPen, faPlus, faThumbTack, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from 'src/app/shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  products: IProduct[] = [];
  p: number = 1;
  filterName = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(
    private service: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reloadProductList();
  }

  reloadProductList(): void{
    this.service.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al cargar la lista de productos:', error)
      }
    );
  }

  modal(id: number, title:string){
    var _popup = this.dialog.open(ProductdetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadProductList();
    })
  }

  create(){
    this.modal(0, 'Crear Producto')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Producto');
    
  }

  addStock(id: number): void {
    Swal.fire({
      title: 'Agregar Stock',
      input: 'number',
      inputAttributes: {
        min: '1'
      },
      inputValidator: (value) => {
        const cantidad = Number(value);
        if (!cantidad || cantidad <= 0) {
          return 'Por favor, ingresa una cantidad válida';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (cantidad) => {
        return this.service.addStock(id, cantidad);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Éxito',
          text: 'Se agregó el stock correctamente',
          icon: 'success'
        });
        this.reloadProductList();
      }
    }).catch((error) => {
      console.error('Error al agregar stock:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al agregar el stock',
        icon: 'error'
      });
    });
  }

  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres cambiar el estado de este producto?",
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
              this.reloadProductList();
            },
            (error) => {
              console.error('Error al cambiar el estado del producto:', error);
            }
          );
        }
      });
    }
  }
  

  delete(id: number): void {
    if (id) {
      Swal.fire({
        title: "Esta seguro de eliminar este producto?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminalo",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteProduct(id).subscribe(
            (response) => {
              Swal.fire({
                title: "El producto fue eliminado!",
                icon: "success"
              });
              this.reloadProductList();
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
