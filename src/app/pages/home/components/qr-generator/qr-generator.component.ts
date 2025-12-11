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
}
