import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DeviceManagerService } from './services/DeviceManager/deviceManager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'PlayChatUI';

  constructor(private deviceManager: DeviceManagerService) {}
}
