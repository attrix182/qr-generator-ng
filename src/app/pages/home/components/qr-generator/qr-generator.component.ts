import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss'],
  standalone: false
})
export class QrGeneratorComponent {
  @Input() url: string = '';
  @Input() fullContent: string = '';
  @Input() hasAdditionalText: boolean = false;
  @Output() urlChange = new EventEmitter<string>();
  @Output() clearUrl = new EventEmitter<void>();

  onUrlChange(value: string): void {
    this.urlChange.emit(value);
  }

  onClearUrl(): void {
    this.clearUrl.emit();
  }
}
