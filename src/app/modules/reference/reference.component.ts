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

  viewimage(id: number): void {
    this.service.getReferenceById(id).subscribe((reference: IReference) => {
  
      const imageUrl: string = `../../../assets/references_images/${reference.image}`;
  
      const newWindow = window.open();

      if (newWindow) {
        console.log("creando");
        const containerDiv = newWindow.document.createElement('div');
        containerDiv.style.display = 'flex';
        containerDiv.style.justifyContent = 'center';
        containerDiv.style.alignItems = 'center';
        containerDiv.style.width = '85%';
        containerDiv.style.height = '85%';
        newWindow.document.body.appendChild(containerDiv);
    
        const imgElement = newWindow.document.createElement('img');
        imgElement.src = imageUrl;
        containerDiv.appendChild(imgElement);
    
        const downloadButton = newWindow.document.createElement('button');
        downloadButton.textContent = 'Descargar imagen';
        downloadButton.style.position = 'absolute'; // Establecer posición absoluta para el botón
        downloadButton.style.bottom = '10px'; // Ajustar posición vertical
        downloadButton.style.right = '10px'; // Ajustar posición horizontal
        downloadButton.style.zIndex = '1'; // Asegurar que el botón esté encima de la imagen
        containerDiv.appendChild(downloadButton);

        downloadButton.addEventListener('click', () => {
          // Crear un enlace temporal para la descarga
          const link = newWindow.document.createElement('a');
          link.href = imageUrl;
          link.download = 'imagen.jpg'; // Nombre de archivo para descargar
          // Simular clic en el enlace
          link.click();
      });
    
    } else {
        console.error("No se pudo abrir la ventana para mostrar la imagen.");
    }
    });
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
    const documentDefinition = {
      content: [
        { margin: [0,0,0,10], columnGap: 2, columns:  [
          { image: await this.util.getBase64ImageFromURL("../../../assets/media/logo-nobg.png"), width: 60},
          { text: `Referencia Nro.${reference.id}`, style: 'header', alignment: 'center' },
        ]},
        { text: `Descripcion: ${reference.description}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Estado: ${reference.status}`, style: 'subheader', margin: [0, 0, 0, 5]},
        { text: `Dibujo de la Referencia`, style: 'subheader', margin: [0, 0, 0, 5]},
        { image: await this.util.getBase64ImageFromURL(`../../../assets/references_images/${reference.image}` ), width: 515, margin: [0,0,0,10]},
        { text: `Insumos Necesarios`, style: 'subheader', margin: [0, 0, 0, 5]},
  
        this.getDetails(reference.details),
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



