import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MeetingComponent } from './meeting.component';
import { VideoPlayerModule } from '../video-player/video-player.module';

@NgModule({
  declarations: [MeetingComponent],
  imports: [BrowserModule, VideoPlayerModule],
  exports: [MeetingComponent],
})
export class MeetingModule {}
