import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';

@Component({
  selector: 'pcui-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  selectedAudioOutputId: string;
  selectedAudioInputId: string;
  selectedVideoDeviceId: string;

  constructor(public readonly deviceManager: DeviceManagerService) {}

  async ngOnInit(): Promise<void> {
    await this.deviceManager.updateMediaDevices();
    this.selectedAudioInputId = this.deviceManager.CurrentAudioInputDevice?.deviceId;
    this.selectedAudioOutputId = this.deviceManager.CurrentAudioOutputDevice?.deviceId;
    this.selectedVideoDeviceId = this.deviceManager.CurrentVideoDevice?.deviceId;
  }

  getCurrentAudioInputDevice = () => this.deviceManager.CurrentAudioInputDevice;

  getCurrentAudioOutputDevice = () => this.deviceManager.CurrentAudioOutputDevice;

  getCurrentVideoDevice = () => this.deviceManager.CurrentVideoDevice;

  updateAudioInput(): void {
    this.deviceManager.CurrentAudioInputDevice = this.deviceManager.getAudioInputDevices().find((s) => s.deviceId === this.selectedAudioInputId);
  }

  updateAudioOutput(): void {
    this.deviceManager.CurrentAudioOutputDevice = this.deviceManager.getAudioOutputDevices().find((s) => s.deviceId === this.selectedAudioOutputId);
  }

  updateVideoDevice(): void {
    this.deviceManager.CurrentVideoDevice = this.deviceManager.getVideoDevices().find((s) => s.deviceId === this.selectedVideoDeviceId);
  }
}
