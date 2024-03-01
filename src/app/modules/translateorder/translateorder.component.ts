import { Component } from '@angular/core';
import { faPen, faThumbTack, faTrash, faInfo} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ITranslateOrder } from 'src/app/core/models/translateorder.model';
import { TranslateorderService } from 'src/app/shared/services/translateorder.service';
import { TranslatedetailComponent } from './translatedetail/translatedetail.component';
import { Utils } from 'src/app/shared/utils/utils';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDetail, IProductionOrder } from 'src/app/core/models/productionorder.model';
import { ProductionorderService } from 'src/app/shared/services/productionorder.service';
import { ContentObserver } from '@angular/cdk/observers';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-translateorder',
  templateUrl: './translateorder.component.html',
  styleUrls: ['./translateorder.component.css']
})
export class TranslateorderComponent {
  transaltes: ITranslateOrder[] = [];
  p: number = 1;
  filterId = '';
  filterField = '';
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash;
  faInfo = faInfo;

  constructor(
    private service: TranslateorderService, 
    private prodservice: ProductionorderService,
    private dailog: MatDialog,
    private util: Utils,
    ) {}

  ngOnInit(): void {
    this.reloadTransalteList();
  }

  reloadTransalteList(): void {
    this.service.getAllTranslates().subscribe( 
      (data) => {
        this.transaltes = data;
      },
      (error) => {
        console.error('Error al cargar la lista de categorías:', error);
      }
    );
  }

  modal(id: number, title:string){
    var _popup = this.dailog.open(TranslatedetailComponent,{
      width: '30%',
      data:{
        title: title,
        id: id
      }
    })
    _popup.afterClosed().subscribe(item =>{    
      this.reloadTransalteList();
    })
  }

  async genpdf(id: number): Promise<void> {
    try {
      const transalte: ITranslateOrder | undefined = await this.service.getTranslateById(id).toPromise();
      if (transalte) {
        await this.generatePdf(transalte);
      } else {
        console.error('La orden de traslado no pudo ser obtenida.');
      }
    } catch (error) {
      console.error('Error generando el PDF:', error);
    }
  }

  create(){
    this.modal(0, 'Crear Orden de Traslado')
  }

  edit(id: number): void {
    this.modal(id, 'Editar Orden de Traslado');
    
  }
  
  status(id: number): void {
    if (id) {
      Swal.fire({
        title: "¿Estás seguro de que quieres completar esta orden de traslado?",
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
              this.reloadTransalteList();
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
        title: "Esta seguro de eliminar esta orden de traslado?",
        text: "Esta accion no es reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminala",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if(result.isConfirmed){
          this.service.deleteTranslate(id).subscribe(
            (response) => {
              Swal.fire({
                title: "La orden de traslado fue eliminada!",
                icon: "success"
              });
              this.reloadTransalteList();
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

  async generatePdf(transalte: ITranslateOrder): Promise<void> {
    this.prodservice.getOpById(transalte.id).subscribe(async prodOrder =>{
      const documentDefinition = {
        content: [
          { margin: [0,0,0,10], columnGap: 2, columns:  [
            { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
            { text: `Orden de Traslado Nro.${transalte.id}`, style: 'header', alignment: 'center' },
          ]},
          { text: `Fecha de Generacion: ${transalte.generationDate}`, style: 'subheader', margin: [0, 0, 0, 5]},
          { text: `Estado: ${transalte.status}`, style: 'subheader', margin: [0, 0, 0, 5]},
          { text: `ID Orden de Produccion:${prodOrder?.id}`, style: 'subheader', margin: [0, 0, 0, 5]},
          { text: `Cliente: ${prodOrder.customer}`, style: 'subheader', margin: [0, 0, 0, 5]},
            this.getDetails(prodOrder.details),
  
        ],
        styles: {
          header: { fontSize: 30, bold: true },
          subheader: { fontSize: 18},
        }
      };
      pdfMake.createPdf(documentDefinition).open();
    })
  }
  

  private getDetails(details: IDetail[]): any {
    const detailLines = details.map(detail => [detail.reference, detail.quantity.toString()]);
    const bodyWithMargins = detailLines.map(row => row.map(cell => ({ text: cell, margin: [0, 0, 0, 5], fontSize: 18})));
    console.log(detailLines);
    
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



