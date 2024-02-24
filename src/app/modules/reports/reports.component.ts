import { Component } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { IProduct } from 'src/app/core/models/product.model';
import { IProductionOrder } from 'src/app/core/models/productionorder.model';
import { IPurchaseOrder } from 'src/app/core/models/purchaseorder.model';
import { ITranslateOrder } from 'src/app/core/models/translateorder.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductionorderService } from 'src/app/shared/services/productionorder.service';
import { PurchaseorderService } from 'src/app/shared/services/purchaseorder.service';
import { TranslateorderService } from 'src/app/shared/services/translateorder.service';
import { Utils } from 'src/app/shared/utils/utils';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  status: string[] = ['Activado', 'Desactivado', 'Completo', 'Incompleto']

  constructor(
    private prodservice: ProductService,
    private purservice: PurchaseorderService,
    private opservice: ProductionorderService,
    private transervice: TranslateorderService,
    private util: Utils,
  ) {}

  async genprodspdf(status: string): Promise<void>{
    try{
      const product: IProduct[] | undefined = await this.prodservice.getAllProducts().toPromise();
      if (product){
        const currentDate = new Date().toLocaleDateString();
        const documentDefinition: TDocumentDefinitions = {
          content: [
            { margin: [0,0,0,10], columnGap: 2, columns:  [
              { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
              { text: `Reporte de Insumos ${status}s`, style: 'header', alignment: 'center' },
            ]},
            { text: `Fecha de Generacion: ${currentDate}`, style: 'subheader', margin: [0, 0, 0, 5]},
            this.getprods(product, status),
          ],
          styles: {
            header: { fontSize: 30, bold: true }
          },
          pageOrientation: 'landscape',
        };
        pdfMake.createPdf(documentDefinition).open();
      }
    }
    catch(e){
      console.error('Error generando el PDF', e)
    }
  }

  private getprods(product: IProduct[], status: string): any {
    const deatilLines = product.filter(product => product.status === status).map(product => [product.id, product.name, product.category, product.stock])
  const bodyWithMargins = deatilLines.map(row => row.map(cell => ({ text: cell, margin: [0, 0, 0, 5], fontSize: 12})));
    return {
      layout: 'lightHorizontalLines',
      table: {
        widths: ['auto', '*', '*', 'auto'],
        body: [
          [{ text: 'Id', style: 'subheader' }, 
          { text: 'Nombre', style: 'subheader' }, 
          { text: 'Categoria', style: 'subheader' }, 
          { text: 'Cantidad', style: 'subheader' }],
          ...bodyWithMargins
        ],
      }
    };
  }

  async genopspdf(status: string): Promise<void> {
    try {
      const op: IProductionOrder[] | undefined = await this.opservice.getAllOp().toPromise();
      if (op) {
        const fechaActual = new Date().toLocaleDateString();
        const content: any[] = [];
        content.push(
          { margin: [0, 0, 0, 10], columnGap: 2, columns:  [
              { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
              { text: `Reporte de Órdenes de Producción ${status}s`, style: 'header', alignment: 'center' },
            ]},
          { text: `Fecha de Generación: ${fechaActual}`, style: 'subheader', margin: [0, 0, 0, 5]}
          );
  
        op.forEach((prodorder: IProductionOrder) => {
          if (prodorder.status === status) {
            const optable = this.createoptable(prodorder);
            content.push(optable);
          }
        });
  
        const definicionDocumento: TDocumentDefinitions = {
          content: content,
          styles : {
            header: { fontSize: 30, bold: true },
            subheader: { fontSize: 12 }
          },
          pageOrientation: 'landscape'
        };
  
        pdfMake.createPdf(definicionDocumento).open();
      }
    } catch (error) {
      console.error('Error generando el informe de órdenes de producción completas', error);
    }
  }
  
  private createoptable(op: IProductionOrder): any {
    const { id, generationDate, deadline, details } = op;
  
    if (details && details.length > 0) {
      const tablebody = [
        [{ text: 'OP ID', style: 'subheader' },{ text: 'Referencia', style: 'subheader' }, { text: 'Fecha Generada', style: 'subheader' }, { text: 'Fecha Limite', style: 'subheader' }, { text: 'Cantidad', style: 'subheader' }],
        ...details.map(detalle => [id.toString(), detalle.reference.toString(), generationDate.toString(), deadline.toString(), detalle.quantity.toString()])
      ];
  
      const estilosTabla = {
        subheader: { fontSize: 12, bold: true }
      };
  
      return {
        table: {
          headerRows: 1,
          widths: ['auto', '*','*','*', 'auto'],
          body: tablebody
        },
        layout: 'lightHorizontalLines',
        style: estilosTabla
      };
    } else {
      return { text: `La orden de producción ${id} no tiene detalles`, style: 'subheader' };
    }
  }

  async genpurpdf(status: string): Promise<void> {
    try {
      const op: IPurchaseOrder[] | undefined = await this.purservice.getAllPurchaseOrders().toPromise();
      if (op) {
        const fechaActual = new Date().toLocaleDateString();
        const content: any[] = [];
        content.push(
          { margin: [0, 0, 0, 10], columnGap: 2, columns:  [
              { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
              { text: `Reporte de Órdenes de Compra ${status}s`, style: 'header', alignment: 'center' },
            ]},
          { text: `Fecha de Generación: ${fechaActual}`, style: 'subheader', margin: [0, 0, 0, 5]}
          );
  
        op.forEach((purchase: IPurchaseOrder) => {
          if (purchase.status === status) {
            const optable = this.createpurchasetable(purchase);
            content.push(optable);
          }
        });
  
        const definicionDocumento: TDocumentDefinitions = {
          content: content,
          styles : {
            header: { fontSize: 30, bold: true },
            subheader: { fontSize: 12 }
          },
          pageOrientation: 'landscape'
        };
  
        pdfMake.createPdf(definicionDocumento).open();
      }
    } catch (error) {
      console.error('Error generando el informe de órdenes de compras completas', error);
    }
  }
  
  private createpurchasetable(op: IPurchaseOrder): any {
    const { id, generationDate, details } = op;
  
    if (details && details.length > 0) {
      const tablebody = [
        [{ text: 'OC ID', style: 'subheader' }, { text: 'Producto', style: 'subheader' },  { text: 'Fecha Generada', style: 'subheader' }, { text: 'Cantidad', style: 'subheader' }],
        ...details.map(detalle => [id.toString(), detalle.product.toString(), generationDate.toString(), detalle.quantity.toString()])
      ];
  
      const estilosTabla = {
        subheader: { fontSize: 12, bold: true }
      };
  
      return {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto'],
          body: tablebody
        },
        layout: 'lightHorizontalLines',
        style: estilosTabla
      };
    } else {
      return { text: `La orden de compra ${id} no tiene detalles`, style: 'subheader' };
    }
  }

  async gentranspdf(status: string): Promise<void> {
    try {
      const op: ITranslateOrder[] | undefined = await this.transervice.getAllTranslates().toPromise();
      if (op) {
        const fechaActual = new Date().toLocaleDateString();
        const content: any[] = [];
        content.push(
          { margin: [0, 0, 0, 10], columnGap: 2, columns:  [
              { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
              { text: `Reporte de Traslados ${status}s`, style: 'header', alignment: 'center' },
            ]},
          { text: `Fecha de Generación: ${fechaActual}`, style: 'subheader', margin: [0, 0, 0, 5]}
          );
  
        op.forEach((translate: ITranslateOrder) => {
          if (translate.status === status) {
            const optable = this.createtranslatetable(translate);
            content.push(optable);
          }
        });
  
        const definicionDocumento: TDocumentDefinitions = {
          content: content,
          styles : {
            header: { fontSize: 30, bold: true },
            subheader: { fontSize: 12 }
          },
          pageOrientation: 'landscape'
        };
  
        pdfMake.createPdf(definicionDocumento).open();
      }
    } catch (error) {
      console.error('Error generando el informe de traslados completas', error);
    }
  }
  
  private createtranslatetable(op: ITranslateOrder): any {
    const { id, generationDate, productionOrder } = op;
  
    if (productionOrder != null) {
      const tableBody = [
        [{ text: 'Traslado ID', style: 'subheader' }, { text: 'OP ID', style: 'subheader' }, { text: 'Fecha Generada', style: 'subheader' }],
        [id.toString(), productionOrder.toString(), generationDate.toString()]
      ];
  
      const estilosTabla = {
        subheader: { fontSize: 12, bold: true }
      };
  
      return {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*'],
          body: tableBody
        },
        layout: 'lightHorizontalLines',
        style: estilosTabla
      };
    } else {
      return { text: `El traslado ${id} no tiene detalles`, style: 'subheader' };
    }
  }
}
