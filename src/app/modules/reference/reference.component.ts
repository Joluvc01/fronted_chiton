import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faPen, faTrash, faThumbTack, faCircleInfo, faImage} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/shared/utils/utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IReference } from 'src/app/core/models/reference.model';
import { ReferenceService } from 'src/app/shared/services/reference.service';
import { ReferencedetailComponent } from './referencedetail/referencedetail.component';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit{
  references: IReference[] =[];
  p: number = 1;
  filterId = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;
  faInfo = faCircleInfo;
  faImage = faImage

  constructor(
    private service:ReferenceService,
    private util: Utils,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
      this.reloadReferenceList();
  }

  reloadReferenceList(): void {
    this.service.getAllReferences().subscribe(
      (data) => {
        this.references = data;
      },
      (error) =>{
        console.error('Error al cargar la lista de referencias', error)
      }
    );
  }

  modal(id: number, title: string){
    var _popup = this.dialog.open(ReferencedetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadReferenceList();
    })
  }

  async genpdf(id:number): Promise <void> {

  }

  create(){
    this.modal(0, 'Crear Referencia')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Referencia');
  }

  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres cambiar el estado de esta referencia?",
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
              this.reloadReferenceList();
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
      });
    }
  }
  
  delete(id: number): void {
    if (id) {
      Swal.fire({
        title: "Esta seguro de eliminar esta referencia?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteReferences(id).subscribe(
            (response) => {
              Swal.fire({
                title: "La orden de compra fue eliminada!",
                icon: "success"
              });
              this.reloadReferenceList();
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


  async generatePdf(reference: IReference): Promise<void>{

  }



}
