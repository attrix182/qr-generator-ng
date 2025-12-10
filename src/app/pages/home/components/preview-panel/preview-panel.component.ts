import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-panel',
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss'],
  standalone: false
})
export class PreviewPanelComponent {
  @Input() content: string = '';
  @Input() hasContent: boolean = false;
}
