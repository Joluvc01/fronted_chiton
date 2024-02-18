import { Component, OnInit } from '@angular/core';
import { IDetail, IPurchaseOrder } from 'src/app/core/models/purchaseorder.model';
import { PurchaseorderService } from 'src/app/shared/services/purchaseorder.service';
import { PurchasedetailComponent } from './purchasedetail/purchasedetail.component';
import { MatDialog } from '@angular/material/dialog';
import { faPen, faTrash, faThumbTack, faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/shared/utils/utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css'],
})
export class PurchaseorderComponent implements OnInit {
  purchases: IPurchaseOrder[] = [];
  p: number = 1;
  filterId = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;
  faInfo = faCircleInfo;

  constructor(
    private service: PurchaseorderService,
    private util: Utils,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reloadPurchaseList();
  }

  reloadPurchaseList(): void {
    this.service.getAllPurchaseOrders().subscribe(
      (data) => {
        this.purchases = data;
      },
      (error) => {
        console.error('Error al cargar la lista de ordenes de compras:', error);
      }
    );
  }

  modal(id:number, title:string){
    var _popup = this.dialog.open(PurchasedetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadPurchaseList();
    })
  }

  async genpdf(id: number): Promise<void> {
    try {
      const purchaseOrder: IPurchaseOrder | undefined = await this.service.getPurchaseOrderById(id).toPromise();
      if (purchaseOrder) {
        await this.generatePdf(purchaseOrder);
      } else {
        console.error('La orden de compra no pudo ser obtenida.');
      }
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
  }

  create(){
    this.modal(0, 'Crear Orden de Compra')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Orden de Compra');
  }

  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres completar esta orden de compra?",
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
              this.reloadPurchaseList();
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
        title: "Esta seguro de eliminar esta orden de compra?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deletePurchaseOrders(id).subscribe(
            (response) => {
              Swal.fire({
                title: "La orden de compra fue eliminada!",
                icon: "success"
              });
              this.reloadPurchaseList();
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
  
  async generatePdf(purchaseOrder: IPurchaseOrder): Promise<void> {
    const documentDefinition = {
      content: [
        { margin: [0,0,0,10], columnGap: 2, columns:  [
          { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
          { text: `Orden de Compra Nro.${purchaseOrder.id}`, style: 'header', alignment: 'center' },
        ]},
        { text: `Fecha Generada: ${purchaseOrder.generationDate}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Estado: ${purchaseOrder.status}`, style: 'subheader', margin: [0, 0, 0, 5]},
        this.getDetails(purchaseOrder.details),
      ],
      styles: {
        header: { fontSize: 30, bold: true },
        subheader: { fontSize: 18},
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
