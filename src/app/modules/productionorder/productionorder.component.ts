import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faPen, faTrash, faCircleInfo, faThumbTack} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/shared/utils/utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDetail, IProductionOrder } from 'src/app/core/models/productionorder.model';
import { ProductionorderService } from 'src/app/shared/services/productionorder.service';
import { ProductiondetailComponent } from './productiondetail/productiondetail.component';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-productionorder',
  templateUrl: './productionorder.component.html',
  styleUrls: ['./productionorder.component.css']
})
export class ProductionorderComponent {
  prodorders: IProductionOrder[] = [];
  p: number = 1;
  filterId = '';
  filterField = '';
  faPen = faPen;
  faTrash = faTrash;
  faInfo = faCircleInfo;
  faThumbTack = faThumbTack;

  constructor(
    private service: ProductionorderService,
    private util: Utils,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reloadProdOrdersList();
  }

  reloadProdOrdersList(): void {
    this.service.getAllOp().subscribe(
      (data) => {
        this.prodorders = data;
      },
      (error) => {
        console.error('Error al cargar la lista de ordenes de produccion:', error);
      }
    );
  }

  hasRole(roles: string | string[], status?: string): boolean {
    const userRole = localStorage.getItem('role');
    if (typeof roles === 'string') {
        roles = [roles];
    }
    const hasRoles = roles.some(role => role === userRole);
    const isStatusComplete = status && status.trim().toLowerCase() === 'completo';
    return hasRoles && !isStatusComplete;
  }



  modal(id:number, title:string){
    var _popup = this.dialog.open(ProductiondetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadProdOrdersList();
    })
  }

  async genpdf(id: number): Promise<void> {
    try {
      const prodOrder: IProductionOrder | undefined = await this.service.getOpById(id).toPromise();
      if (prodOrder) {
        await this.generatePdf(prodOrder);
      } else {
        console.error('La orden de produccion no pudo ser obtenida.');
      }
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
  }

  create(){
    this.modal(0, 'Crear Orden de Produccion')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Orden de Produccion');
  }

  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres completar esta orden de produccion?",
        text: "Esta accion no es reversible!",
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
              this.reloadProdOrdersList();
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
        title: "Esta seguro de eliminar esta orden de produccion?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteOp(id).subscribe(
            (response) => {
              Swal.fire({
                title: "La orden de produccion fue eliminada!",
                icon: "success"
              });
              this.reloadProdOrdersList();
              console.log(response);
            },
            (error) => {
              let errorText = "Se produjo un error al eliminar la orden de Produccion.";
              errorText += "<br>ID Ordenes de Traslado asociado:" + error.error;
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
  
  async generatePdf(prodOrder: IProductionOrder): Promise<void> {
    const logoImage = await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png");
  
    const documentDefinition: any = {
      content: [
        { margin: [0,0,0,10], columnGap: 2, columns:  [
          { image: logoImage, width: 60},
          { text: `Orden de Produccion Nro.${prodOrder.id}`, style: 'header', alignment: 'center' },
        ]},
        { text: `Cliente: ${prodOrder.customer}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Fecha Generada: ${prodOrder.generationDate}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Fecha Limite: ${prodOrder.deadline}`, style: 'subheader', margin: [0, 0, 0, 5]},
      ],
      styles: {
        header: { fontSize: 30, bold: true },
        subheader: { fontSize: 18},
      }
    };
  
    if (prodOrder.completedDate !== null) {
      documentDefinition.content.push(
        { text: `Fecha Completada: ${prodOrder.completedDate}`, style: 'subheader', margin: [0, 0, 0, 5] }
      );
    }
  
    documentDefinition.content.push(
      { text: `Estado: ${prodOrder.status}`, style: 'subheader', margin: [0, 0, 0, 5] },
      this.getDetails(prodOrder.details),
    );
  
    const pdf = pdfMake.createPdf(documentDefinition);
    pdf.open();
  }
  

  private getDetails(details: IDetail[]): any {
    const detailLines = details.map(detail => [detail.reference, detail.quantity.toString()]);
    // Agrega márgenes a cada celda individual
    const bodyWithMargins = detailLines.map(row => row.map(cell => ({ text: cell, margin: [0, 0, 0, 5], fontSize: 18})));
    return {
      layout: 'lightHorizontalLines',
      table: {
        widths: ['*', 'auto'],
        body: [
          [{ text: 'Referencia', style: 'subheader' }, { text: 'Cantidad', style: 'subheader' }],
          ...bodyWithMargins
        ],
      }
    };
  }

}
