import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';
import { AudioDevice } from 'src/app/services/DeviceManager/mediaDevices';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  constructor(private deviceManager: DeviceManagerService) {}

  ngOnInit(): void {}

  getAudioInputDevices = () => this.deviceManager.getAudioInputDeviceInfo();
  getCurrentAudioInputDevice(): AudioDevice {
    return this.deviceManager.CurrentAudioInputDevice;
  }

  getAudioOutputDevices = () => this.deviceManager.getAudioOutputDeviceInfo();
  getCurrentAudioOutputDevice(): AudioDevice {
    return this.deviceManager.CurrentAudioOutputDevice;
  }
}
