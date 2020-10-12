import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebRTCService {
  private remoteStreams: MediaStream[];
  public get remoteVideoStreams(): MediaStream[] {
    return this.remoteStreams.filter((f) => f.getVideoTracks().length > 0);
  }
  constructor() {
    this.remoteStreams = [];
  }
}
