import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MeetingComponent } from './meeting.component';

@NgModule({
  declarations: [MeetingComponent],
  imports: [BrowserModule],
  exports: [MeetingComponent],
})
export class MeetingModule {}
