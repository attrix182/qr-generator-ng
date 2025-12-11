import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  public url: string = '';
  public additionalText: string = '';
  public showModal: boolean = false;
  public linkPosition: 'start' | 'end' = 'start';
  public scannedContent: string = '';
  public isViewMode: boolean = false;
  public copySuccess: boolean = false;
  public showQRModal: boolean = false;
  public isMobile: boolean = window.innerWidth < 992;

  private readonly STORAGE_KEY_URL = 'qr-generator-url';
  private readonly STORAGE_KEY_ADDITIONAL_TEXT = 'qr-generator-additional-text';
  private readonly STORAGE_KEY_LINK_POSITION = 'qr-generator-link-position';
  private readonly TOUR_STORAGE_KEY = 'qr-generator-tour-completed';
  private urlSaveTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private guidedTourService: GuidedTourService
  ) { }

  ngOnInit(): void {
    // Verificar si hay un query parameter (modo vista de QR escaneado)
    this.route.queryParams.subscribe(params => {
      if (params['content']) {
        this.scannedContent = decodeURIComponent(params['content']);
        this.isViewMode = true;
      } else {
        // Cargar datos del localStorage solo si no estamos en modo vista
        this.loadFromLocalStorage();
        // Iniciar tour guiado solo en desktop
        this.initGuidedTour();
      }
    });
  }

  private initGuidedTour(): void {
    // Solo iniciar el tour en dispositivos desktop (no mobile)
    if (!this.isMobile && !this.isViewMode) {
      // Verificar si el usuario ya completó el tour
      const tourCompleted = localStorage.getItem(this.TOUR_STORAGE_KEY);

      if (!tourCompleted) {
        // Usar el mismo método pero con delay inicial
        setTimeout(() => {
          this.startTourInternal();
        }, 1000);
      }
    }
  }

  startTour(): void {
    // Solo iniciar el tour en dispositivos desktop (no mobile)
    if (this.isMobile || this.isViewMode) {
      return;
    }

    // Llamar al método interno directamente
    // El servicio maneja automáticamente si hay un tour activo
    this.startTourInternal();
  }

  private startTourInternal(): void {
    // Filtrar los pasos basándose en los elementos disponibles en el DOM
    const availableSteps = this.TOUR_STEPS.filter((step) => {
      const element = document.querySelector(step.selector);
      return element !== null;
    });

    if (availableSteps.length === 0) {
      // Reintentar después de un tiempo adicional
      setTimeout(() => this.startTourInternal(), 500);
      return;
    }

    const tour: GuidedTour = {
      tourId: 'qr-generator-tour',
      useOrb: false,
      steps: availableSteps,
      skipCallback: (stepSkippedOn: number) => {
        console.log(`Tour saltado en el paso ${stepSkippedOn}`);
        localStorage.setItem(this.TOUR_STORAGE_KEY, 'skipped');
      },
      completeCallback: () => {
        console.log('Tour completado');
        localStorage.setItem(this.TOUR_STORAGE_KEY, 'completed');
      }
    };

    try {
      this.guidedTourService.startTour(tour);
    } catch (error) {
      console.error('[Tour] Error al iniciar el tour:', error);
    }
  }

  private readonly TOUR_STEPS = [
    {
      title: 'Configuración (Nuevo)',
      selector: '.settings-btn',
      content: 'Ingresa para configurar un texto adicional que se agregará antes o despues de la URL',
      orientation: Orientation.Left
    },
    {
      title: 'Campo de entrada',
      selector: '.qr-input',
      content: 'Ingresa el texto o URL que deseas compartir',
      orientation: Orientation.Bottom
    },
    {
      title: 'Vista Previa',
      selector: '.preview-panel',
      content: 'Aquí verás una vista previa del contenido completo que se generará en el QR',
      orientation: Orientation.Left
    },
    {
      title: 'Ahora es mas facil (Nuevo)',
      selector: '.qr-display-container',
      content: 'Este QR te llevará a una pagina donde vas a ver un botón para copiar o compartir el texto',
      orientation: Orientation.Right
    }
  ];

  // Contenido real que se mostrará cuando se escanee el QR
  get actualContent(): string {
    if (!this.url) return '';
    if (!this.additionalText) return this.url;

    if (this.linkPosition === 'start') {
      return `${this.url}\n\n${this.additionalText}`;
    } else {
      return `${this.additionalText}\n\n${this.url}`;
    }
  }

  // URL que se codificará en el QR (apunta a esta misma página con el contenido como query param)
  get fullContent(): string {
    if (!this.url) return '';

    // Siempre generamos la URL completa con el contenido como query parameter
    // para que siempre se abra en modo vista previa
    // Usamos hash location para compatibilidad con Netlify
    const content = this.actualContent;
    const encodedContent = encodeURIComponent(content);
    const baseUrl = window.location.origin;
    // Con HashLocationStrategy, la ruta va después del hash
    return `${baseUrl}/#/?content=${encodedContent}`;
  }

  private loadFromLocalStorage(): void {
    try {
      const savedUrl = localStorage.getItem(this.STORAGE_KEY_URL);
      const savedAdditionalText = localStorage.getItem(this.STORAGE_KEY_ADDITIONAL_TEXT);
      const savedLinkPosition = localStorage.getItem(this.STORAGE_KEY_LINK_POSITION);

      if (savedUrl) {
        this.url = savedUrl;
      }

      if (savedAdditionalText) {
        this.additionalText = savedAdditionalText;
      }

      if (savedLinkPosition === 'start' || savedLinkPosition === 'end') {
        this.linkPosition = savedLinkPosition;
      }
    } catch (error) {
      console.warn('Error al cargar del localStorage:', error);
    }
  }

  onUrlChange(value: string): void {
    // Actualizar inmediatamente para que el QR se genere en tiempo real
    this.url = value;

    // Guardar URL con debounce para evitar guardar en cada tecla
    if (this.urlSaveTimeout) {
      clearTimeout(this.urlSaveTimeout);
    }

    this.urlSaveTimeout = setTimeout(() => {
      this.saveUrlToLocalStorage();
    }, 500);
  }

  private saveUrlToLocalStorage(): void {
    try {
      if (this.url) {
        localStorage.setItem(this.STORAGE_KEY_URL, this.url);
      } else {
        localStorage.removeItem(this.STORAGE_KEY_URL);
      }
    } catch (error) {
      console.warn('Error al guardar URL en localStorage:', error);
    }
  }

  saveAdditionalTextToLocalStorage(): void {
    try {
      if (this.additionalText) {
        localStorage.setItem(this.STORAGE_KEY_ADDITIONAL_TEXT, this.additionalText);
      } else {
        localStorage.removeItem(this.STORAGE_KEY_ADDITIONAL_TEXT);
      }
    } catch (error) {
      console.warn('Error al guardar texto adicional en localStorage:', error);
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveAdditionalText(): void {
    this.saveAdditionalTextToLocalStorage();
    this.saveLinkPositionToLocalStorage();
    this.closeModal();
  }

  onAdditionalTextChange(value: string): void {
    this.additionalText = value;
    this.saveAdditionalTextToLocalStorage();
  }

  onLinkPositionChange(value: 'start' | 'end'): void {
    this.linkPosition = value;
    this.saveLinkPositionToLocalStorage();
  }

  private saveLinkPositionToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_LINK_POSITION, this.linkPosition);
    } catch (error) {
      console.warn('Error al guardar posición del link en localStorage:', error);
    }
  }

  clearAdditionalText(): void {
    this.additionalText = '';
    try {
      localStorage.removeItem(this.STORAGE_KEY_ADDITIONAL_TEXT);
    } catch (error) {
      console.warn('Error al limpiar localStorage:', error);
    }
  }

  clearUrl(): void {
    this.url = '';
    try {
      localStorage.removeItem(this.STORAGE_KEY_URL);
    } catch (error) {
      console.warn('Error al limpiar URL del localStorage:', error);
    }
  }

  copyToClipboard(): void {
    const contentToCopy = this.scannedContent || this.actualContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contentToCopy).then(() => {
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar:', err);
        this.fallbackCopyToClipboard(contentToCopy);
      });
    } else {
      this.fallbackCopyToClipboard(contentToCopy);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }

    document.body.removeChild(textArea);
  }

  goBack(): void {
    this.router.navigate(['/'], { replaceUrl: true });
    this.isViewMode = false;
    this.scannedContent = '';
    this.showQRModal = false;
  }

  openQRModal(): void {
    this.showQRModal = true;
  }

  closeQRModal(): void {
    this.showQRModal = false;
  }

  get scannedContentForQR(): string {
    return this.scannedContent;
  }

  downloadQR(): void {
    // Buscar el elemento canvas del QR dentro del modal
    setTimeout(() => {
      const modal = document.querySelector('.qr-modal-content');
      const canvas = modal?.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        // Crear un enlace de descarga
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('No se pudo encontrar el canvas del QR');
      }
    }, 200);
  }

}
