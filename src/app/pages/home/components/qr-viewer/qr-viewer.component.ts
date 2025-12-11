import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qr-viewer',
  templateUrl: './qr-viewer.component.html',
  styleUrls: ['./qr-viewer.component.scss'],
  standalone: false
})
export class QrViewerComponent {
  @Input() scannedContent: string = '';
  @Input() copySuccess: boolean = false;
  @Output() copyToClipboard = new EventEmitter<void>();
  @Output() openQRModal = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  onCopyToClipboard(): void {
    this.copyToClipboard.emit();
  }

  onOpenQRModal(): void {
    this.openQRModal.emit();
  }

  onGoBack(): void {
    this.goBack.emit();
  }

  async onShare(): Promise<void> {
    if (navigator.share && this.scannedContent) {
      try {
        await navigator.share({
          title: 'Contenido del QR',
          text: this.scannedContent,
        });
      } catch (error) {
        // El usuario canceló el compartir o hubo un error
        if ((error as Error).name !== 'AbortError') {
          console.error('Error al compartir:', error);
        }
      }
    } else {
      // Fallback: copiar al portapapeles si la API de compartir no está disponible
      this.onCopyToClipboard();
    }
  }

  get canShare(): boolean {
    return !!navigator.share;
  }
}
