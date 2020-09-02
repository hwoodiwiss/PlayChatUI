import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DeviceManagerService } from './services/DeviceManager/deviceManager.service';
import { ConfigurationService } from './services/Configuration/configuration.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { OptionsComponent } from './components/options/options.component';

@NgModule({
  declarations: [AppComponent, MeetingComponent, OptionsComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [DeviceManagerService, ConfigurationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
