import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';
import { WebRTCService } from '../../services/WebRTC/webRtc.service';

@Component({
  selector: 'pcui-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  videoStream: MediaStream;
  constructor(public readonly deviceManager: DeviceManagerService, public readonly webRTCService: WebRTCService) {}

  async ngOnInit(): Promise<void> {
    await this.deviceManager.updateMediaDevices();
    this.videoStream = await this.deviceManager.CurrentVideoDevice.getVideoStream(1920, 1080);
  }
}
