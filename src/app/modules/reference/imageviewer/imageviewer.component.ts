import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReference } from 'src/app/core/models/reference.model';
import { ReferenceService } from 'src/app/shared/services/reference.service';

@Component({
  selector: 'app-imageviewer',
  templateUrl: './imageviewer.component.html',
  styleUrls: ['./imageviewer.component.css']
})
export class ImageviewerComponent {
  @ViewChild('imageContainer') imageContainer: ElementRef | undefined;
  reference: IReference | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ReferenceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Obtener el ID de la URL
      this.service.getReferenceById(id).subscribe((reference: IReference) => {
        this.reference = reference;
      },
      (error) => {
        console.error("Error al cargar la referencia:", error);
        this.router.navigate(['/error']); // Redirigir a la página de error
      });
    });
  }

  downloadImage(imageUrl: string): void {
    // Crear un enlace temporal para la descarga
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'imagen.jpg'; // Nombre de archivo para descargar
    // Simular clic en el enlace
    link.click();
  }

  adjustImageSize(event: any): void {
    const img = event.target;
    const container = this.imageContainer?.nativeElement;
    if (img.width < container.offsetWidth && img.height < container.offsetHeight) {
      // Si la imagen es más pequeña que el contenedor, ajusta el tamaño de la imagen para que ocupe al menos el ancho y el alto del contenedor
      img.style.width = '100%';
      img.style.height = '100%';
    } else {
      // Si la imagen es más grande que el contenedor, restablece el tamaño de la imagen a su tamaño original
      img.style.width = 'auto';
      img.style.height = 'auto';
    }
  }
}
