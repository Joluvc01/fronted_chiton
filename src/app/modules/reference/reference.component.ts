import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faPen, faTrash, faThumbTack, faCircleInfo, faImage} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/shared/utils/utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDetail, IReference } from 'src/app/core/models/reference.model';
import { ReferenceService } from 'src/app/shared/services/reference.service';
import { ReferencedetailComponent } from './referencedetail/referencedetail.component';
import { Router } from '@angular/router';
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
  faImage = faImage;

  constructor(
    private service:ReferenceService,
    private util: Utils,
    private dialog: MatDialog,
    private router: Router
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

  hasRole(roles: string | string[]): boolean {
    const userRole = localStorage.getItem('role');
    
    if (typeof roles === 'string') {
      roles = [roles];
    }
    
    return roles.some(role => role === userRole);
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

  viewimage(id: number): void {
    console.log(`Navegando a la ruta '/image/${id}'`);
    this.router.navigate(['references/image', id]);
}

  
  async genpdf(id:number): Promise <void> {
    try {
      const reference: IReference | undefined = await this.service.getReferenceById(id).toPromise();
      if (reference) {
        await this.generatePdf(reference);
      } else {
        console.error('La orden de compra no pudo ser obtenida.');
      }
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
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
                title: "La referencia fue eliminada!",
                icon: "success"
              });
              this.reloadReferenceList();
              console.log(response);
            },
            (error) => {
              console.error("Error object:", error);
              let errorMessage = JSON.parse(error.error);
              console.log(errorMessage);
              
              let OP = errorMessage.OP.join(", ");
              
              let errorText = "Se produjo un error al eliminar la referencia.";
              if (OP) {
                  errorText += "<br>ID Ordenes de Produccion asociadas:" + OP;
              }
          
              Swal.fire({
                  title: "Error",
                  html: errorText,
                  icon: "error"
              });
          }
          );
        }
      })
    }
  }


  async generatePdf(reference: IReference): Promise<void>{
    const documentDefinition = {
      content: [
        { margin: [0,0,0,10], columnGap: 2, columns:  [
          { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
          { text: `Referencia Nro.${reference.id}`, style: 'header', alignment: 'center' },
        ]},
        { text: `Descripcion: ${reference.description}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Estado: ${reference.status}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Dibujo de la Referencia`, style: 'pre', margin: [0, 0, 0, 5]},
        { image: await this.util.getBase64ImageFromURL(`../../../assets/references_images/${reference.image}` ), width: 515, margin: [0,0,0,10]},
        { text: `Insumos Necesarios`, style: 'pre', margin: [0, 0, 0, 5]},
  
        this.getDetails(reference.details),
      ],
      styles: {
        header: { fontSize: 30, bold: true },
        subheader: { fontSize: 18},
        pre: { fontSize: 20, bold: true},
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  
  private getDetails(details: IDetail[]): any {
    const detailLines = details.map(detail => [detail.product, detail.quantity.toString()]);
    // Agrega márgenes a cada celda individual
    const bodyWithMargins = detailLines.map(row => row.map(cell => ({ text: cell, margin: [0, 0, 0, 5], fontSize: 18})));
    return {
      layout: 'lightHorizontalLines',
      table: {
        widths: ['*', 'auto'],
        body: [
          [{ text: 'Producto', style: 'subheader' }, { text: 'Cantidad', style: 'subheader' }],
          ...bodyWithMargins
        ],
      }
    };
  }

}



