import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss'],
  standalone: false
})
export class QrGeneratorComponent implements OnChanges {
  @Input() url: string = '';
  @Input() fullContent: string = '';
  @Input() hasAdditionalText: boolean = false;
  @Output() urlChange = new EventEmitter<string>();
  @Output() clearUrl = new EventEmitter<void>();

  public localUrl: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && changes['url'].currentValue !== this.localUrl) {
      this.localUrl = changes['url'].currentValue || '';
    }
  }

  onUrlChange(value: string): void {
    this.localUrl = value;
    this.urlChange.emit(value);
  }

  onClearUrl(): void {
    this.localUrl = '';
    this.clearUrl.emit();
  }

  onQRClick(): void {
    if (this.fullContent) {
      // Si el contenido es una URL (empieza con http:// o https://), abrirla
      if (this.fullContent.startsWith('http://') || this.fullContent.startsWith('https://')) {
        window.open(this.fullContent, '_blank');
      } else {
        // Si no es una URL directa, intentar abrirla de todas formas
        // (podría ser una URL generada con query params)
        try {
          window.open(this.fullContent, '_blank');
        } catch (error) {
          console.error('Error al abrir el enlace:', error);
        }
      }
    }
  }
}
