import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebRTCService {
  private mediaStreams: MediaStream[];
  public get VideoStreams(): MediaStream[] {
    return this.mediaStreams?.filter((stream) => stream.getVideoTracks()?.length > 0) ?? [];
  }

  constructor() {}
}
