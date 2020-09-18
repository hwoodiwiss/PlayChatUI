import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DeviceManagerService } from './services/DeviceManager/deviceManager.service';
import { ConfigurationService } from './services/Configuration/configuration.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingModule } from './components/meeting/meeting.module';
import { OptionsModule } from './components/options/options.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, OptionsModule, MeetingModule],
  providers: [DeviceManagerService, ConfigurationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
