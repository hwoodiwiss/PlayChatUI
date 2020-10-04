import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { VideoPlayerComponent } from './video-player.component';

@NgModule({
  declarations: [VideoPlayerComponent],
  imports: [BrowserModule],
  exports: [VideoPlayerComponent],
})
export class VideoPlayerModule {}
