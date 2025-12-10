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
}
