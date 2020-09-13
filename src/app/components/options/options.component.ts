import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';
import { AudioDevice } from 'src/app/services/DeviceManager/mediaDevices';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  selectedAudioOutputId: string;
  selectedAudioInputId: string;
  selectedVideoDeviceId: string;

  constructor(private deviceManager: DeviceManagerService) {}

  async ngOnInit(): Promise<void> {
    await this.deviceManager.updateMediaDevices();
    this.selectedAudioInputId = this.deviceManager.CurrentAudioInputDevice?.deviceId;
    this.selectedAudioOutputId = this.deviceManager.CurrentAudioOutputDevice?.deviceId;
    this.selectedVideoDeviceId = this.deviceManager.CurrentVideoDevice?.deviceId;
  }

  getAudioInputDevices = () => this.deviceManager.getAudioInputDeviceInfo();
  getCurrentAudioInputDevice = () => this.deviceManager.CurrentAudioInputDevice;

  getAudioOutputDevices = () => this.deviceManager.getAudioOutputDeviceInfo();
  getCurrentAudioOutputDevice = () => this.deviceManager.CurrentAudioOutputDevice;

  getVideoDevices = () => this.deviceManager.getVideoDeviceInfo();
  getCurrentVideoDevice = () => this.deviceManager.CurrentVideoDevice;

  updateAudioInput(): void {
    this.deviceManager.CurrentAudioInputDevice = this.deviceManager.getAudioInputDeviceInfo().find((s) => s.deviceId === this.selectedAudioInputId);
  }

  updateAudioOutput(): void {
    this.deviceManager.CurrentAudioOutputDevice = this.deviceManager.getAudioOutputDeviceInfo().find((s) => s.deviceId === this.selectedAudioOutputId);
  }

  updateVideoDevice(): void {
    this.deviceManager.CurrentVideoDevice = this.deviceManager.getVideoDeviceInfo().find((s) => s.deviceId === this.selectedVideoDeviceId);
  }
}
