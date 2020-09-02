import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  constructor(private deviceManager: DeviceManagerService) { }

  ngOnInit(): void {
  }

  getVideoDevices = () => this.deviceManager.getVideoDeviceInfo();
  getAudioOutputDevices = () => this.deviceManager.getAudioOutputDeviceInfo();
  getAudioInputDevices = () => this.deviceManager.getAudioInputDeviceInfo();
}
