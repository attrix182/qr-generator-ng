import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  standalone: false
})
export class SettingsModalComponent {
  @Input() show: boolean = false;
  @Input() additionalText: string = '';
  @Input() linkPosition: 'start' | 'end' = 'start';
  @Input() url: string = '';
  @Input() actualContent: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() additionalTextChange = new EventEmitter<string>();
  @Output() linkPositionChange = new EventEmitter<'start' | 'end'>();
  @Output() clearAdditionalText = new EventEmitter<void>();

  onClose(): void {
    // Emitir evento de guardar antes de cerrar
    this.close.emit();
  }

  onAdditionalTextChange(value: string): void {
    this.additionalTextChange.emit(value);
  }

  onLinkPositionChange(value: 'start' | 'end'): void {
    this.linkPosition = value;
    this.linkPositionChange.emit(value);
  }

  onClearAdditionalText(): void {
    this.clearAdditionalText.emit();
  }
}
