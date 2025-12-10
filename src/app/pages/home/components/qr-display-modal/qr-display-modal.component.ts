import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qr-display-modal',
  templateUrl: './qr-display-modal.component.html',
  styleUrls: ['./qr-display-modal.component.scss'],
  standalone: false
})
export class QrDisplayModalComponent {
  @Input() show: boolean = false;
  @Input() content: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onDownload(): void {
    this.download.emit();
  }
}
