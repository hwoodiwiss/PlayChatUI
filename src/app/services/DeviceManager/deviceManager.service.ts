import { Injectable } from '@angular/core';
import { AudioDevice, VideoDevice } from './mediaDevices';
import { ConfigurationService } from '../Configuration/configuration.service';
import '../../extensions';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagerService {
  private devicesChanged: Subject<void> = new Subject<void>();
  private videoDevices = new Map<string, VideoDevice>();
  private audioInputDevices = new Map<string, AudioDevice>();
  private audioOutputDevices = new Map<string, AudioDevice>();
  private errors: string[] = [];

  private currentVideoDevice: VideoDevice;
  public get CurrentVideoDevice(): VideoDevice {
    return this.currentVideoDevice;
  }
  public set CurrentVideoDevice(device: VideoDevice) {
    const config = this.configurationService.getConfiguration();
    config.videoDeviceId = device.deviceId;
    this.configurationService.updateConfig();
    this.currentVideoDevice = device;
  }

  private currentAudioInputDevice: AudioDevice;
  public get CurrentAudioInputDevice(): AudioDevice {
    return this.currentAudioInputDevice;
  }
  public set CurrentAudioInputDevice(device: AudioDevice) {
    const config = this.configurationService.getConfiguration();
    config.audioInputId = device.deviceId;
    this.configurationService.updateConfig();
    this.currentAudioInputDevice = device;
  }

  private currentAudioOutputDevice: AudioDevice;
  public get CurrentAudioOutputDevice(): AudioDevice {
    return this.currentAudioOutputDevice;
  }
  public set CurrentAudioOutputDevice(device: AudioDevice) {
    const config = this.configurationService.getConfiguration();
    config.audioOutputId = device.deviceId;
    this.configurationService.updateConfig();
    this.currentAudioOutputDevice = device;
  }

  constructor(private configurationService: ConfigurationService) {
    this.init();
  }

  async init(): Promise<void> {
    this.ensureDevicePermissions()
      .then(async () => {
        await this.updateMediaDevices();
        navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeHandler);
      })
      .catch((err) => {
        this.errors.push(err);
      });
  }

  private async deviceChangeHandler(): Promise<void> {
    await this.updateMediaDevices();
    this.devicesChanged.next();
  }

  onDevicesChanged(onChange: () => void): Subscription {
    return this.devicesChanged.subscribe(onChange);
  }

  async ensureDevicePermissions(): Promise<void> {
    const micPermissionResult = await navigator.permissions.query({
      name: 'microphone',
    });
    if (micPermissionResult.state === 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        throw new Error('This application requires mic access to function.');
      }
    } else if (micPermissionResult.state === 'denied') {
      throw new Error('This application requires mic access to function.');
    }

    const cameraPermissionResult = await navigator.permissions.query({
      name: 'camera',
    });
    if (cameraPermissionResult.state === 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch {
        throw new Error('This application requires camera access to function.');
      }
    } else if (cameraPermissionResult.state === 'denied') {
      throw new Error('This application requires camera access to function.');
    }
  }

  async updateMediaDevices(): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs: MediaDeviceInfo[] = [];
    const audioOutputs: MediaDeviceInfo[] = [];

    for (const device of devices) {
      if (device.kind === 'videoinput') {
        this.videoDevices.set(device.deviceId, new VideoDevice(device));
      } else if (device.kind === 'audioinput') {
        audioInputs.push(device);
        if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
          this.audioInputDevices.set(device.deviceId, new AudioDevice(device));
        }
      } else if (device.kind === 'audiooutput') {
        audioOutputs.push(device);
        if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
          this.audioOutputDevices.set(device.deviceId, new AudioDevice(device));
        }
      }
    }
    this.setDefaultAudioDevices(audioInputs, this.audioInputDevices);
    this.setDefaultAudioDevices(audioOutputs, this.audioOutputDevices);
    const config = this.configurationService.getConfiguration();
    if (config.videoDeviceId) {
      this.currentVideoDevice = this.videoDevices.find((item) => item[1].deviceId === config.videoDeviceId).value;
    }

    if (config.audioInputId) {
      this.currentAudioInputDevice = this.audioInputDevices.find((item) => item[1].deviceId === config.audioInputId).value;
    }

    if (config.audioOutputId) {
      this.currentAudioOutputDevice = this.audioOutputDevices.find((item) => item[1].deviceId === config.audioOutputId).value;
    }

    if (!this.currentVideoDevice) {
      this.currentVideoDevice = this.videoDevices.find()?.value;
    }

    if (!this.currentAudioInputDevice) {
      this.currentAudioInputDevice = this.audioInputDevices.find((item) => item[1].isCommunicationDefault === true)?.value ?? this.audioInputDevices.find()?.value;
    }

    if (!this.currentAudioOutputDevice) {
      this.currentAudioOutputDevice =
        this.audioOutputDevices.find((item) => item[1].isCommunicationDefault === true)?.value ?? this.audioOutputDevices.find()?.value;
    }
  }

  private setDefaultAudioDevices(devices: MediaDeviceInfo[], audioDeviceMap: Map<string, AudioDevice>): void {
    const defaultDeviceName = devices.filter((w) => w.deviceId === 'default').map((s) => s.label.substr('Default - '.length))[0];
    const defaultComsDeviceName = devices.filter((w) => w.deviceId === 'communications').map((s) => s.label.substr('Communications - '.length))[0];
    const defaultDevice = audioDeviceMap.find((item) => item[1].deviceLabel === defaultDeviceName);
    if (defaultDevice) {
      defaultDevice.value.isDefault = true;
    }
    const defaultComsDevice = audioDeviceMap.find((item) => item[1].deviceLabel === defaultComsDeviceName);
    if (defaultComsDevice) {
      defaultComsDevice.value.isCommunicationDefault = true;
    }
  }

  public getVideoDeviceInfo = () => [...this.videoDevices.values()];
  public getAudioInputDeviceInfo = () => [...this.audioInputDevices.values()];
  public getAudioOutputDeviceInfo = () => [...this.audioOutputDevices.values()];
}
