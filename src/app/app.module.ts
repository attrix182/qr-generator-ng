import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { QrGeneratorComponent } from './pages/home/components/qr-generator/qr-generator.component';
import { QrViewerComponent } from './pages/home/components/qr-viewer/qr-viewer.component';
import { SettingsModalComponent } from './pages/home/components/settings-modal/settings-modal.component';
import { QrDisplayModalComponent } from './pages/home/components/qr-display-modal/qr-display-modal.component';
import { PreviewPanelComponent } from './pages/home/components/preview-panel/preview-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QrGeneratorComponent,
    QrViewerComponent,
    SettingsModalComponent,
    QrDisplayModalComponent,
    PreviewPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeComponent,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
