import { Injectable } from '@angular/core';
import { AudioInputDevice, AudioOutputDevice, VideoDevice } from './mediaDevices';
import { ConfigurationService } from '../Configuration/configuration.service';
import '../../extensions';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagerService {
  private devicesChanged: Subject<void> = new Subject<void>();
  private videoDevices = new Map<string, VideoDevice>();
  private audioInputDevices = new Map<string, AudioInputDevice>();
  private audioOutputDevices = new Map<string, AudioOutputDevice>();
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

  private currentAudioInputDevice: AudioInputDevice;
  public get CurrentAudioInputDevice(): AudioInputDevice {
    return this.currentAudioInputDevice;
  }
  public set CurrentAudioInputDevice(device: AudioInputDevice) {
    const config = this.configurationService.getConfiguration();
    config.audioInputId = device.deviceId;
    this.configurationService.updateConfig();
    this.currentAudioInputDevice = device;
  }

  private currentAudioOutputDevice: AudioOutputDevice;
  public get CurrentAudioOutputDevice(): AudioOutputDevice {
    return this.currentAudioOutputDevice;
  }
  public set CurrentAudioOutputDevice(device: AudioOutputDevice) {
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
          this.audioInputDevices.set(device.deviceId, new AudioInputDevice(device));
        }
      } else if (device.kind === 'audiooutput') {
        audioOutputs.push(device);
        if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
          this.audioOutputDevices.set(device.deviceId, new AudioOutputDevice(device));
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

  private setDefaultAudioDevices(devices: MediaDeviceInfo[], audioDeviceMap: Map<string, any>): void {
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

  public getVideoDevices = () => [...this.videoDevices.values()];
  public getAudioInputDevices = () => [...this.audioInputDevices.values()];
  public getAudioOutputDevices = () => [...this.audioOutputDevices.values()];
}
