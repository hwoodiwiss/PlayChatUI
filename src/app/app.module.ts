import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookiesModule } from 'angular-cookies'

import { DeviceManagerService } from './services/DeviceManager/deviceManager.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingComponent } from './meeting/meeting.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CookiesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
