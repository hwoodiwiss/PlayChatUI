import { Injectable } from '@angular/core';
import { AudioDeviceInfo, VideoDeviceInfo } from './mediaDevices';
import '../extensions';


@Injectable({
  providedIn: 'root',
})
export class DeviceManagerService {
  private videoDevices = new Map<string, VideoDeviceInfo>();
  private audioInputDevices = new Map<string, AudioDeviceInfo>();
  private audioOutputDevices = new Map<string, AudioDeviceInfo>();
  private errors: string[] = [];

  constructor() {
    this.ensureDevicePermissions()
      .then(() => {
        this.updateMediaDevices();
        navigator.mediaDevices.ondevicechange = () => {
          this.updateMediaDevices();
        };
      })
      .catch((err) => {
        this.errors.push[err];
        console.error(err);
      });
  }

  async ensureDevicePermissions() {
    const micPermissionResult = await navigator.permissions.query({
      name: 'microphone',
    });
    if (micPermissionResult.state == 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        throw new Error('This application requires mic access to function.');
      }
    } else if (micPermissionResult.state == 'denied') {
      throw new Error('This application requires mic access to function.');
    }

    const cameraPermissionResult = await navigator.permissions.query({
      name: 'camera',
    });
    if (cameraPermissionResult.state == 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch {
        throw new Error('This application requires camera access to function.');
      }
    } else if (cameraPermissionResult.state == 'denied') {
      throw new Error('This application requires camera access to function.');
    }
  }

  private updateMediaDevices() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputs: MediaDeviceInfo[] = [];
      const audioOutputs: MediaDeviceInfo[] = [];

      for (const device of devices) {
        if (device.kind === 'videoinput') {
          this.videoDevices.set(device.deviceId, new VideoDeviceInfo(device));
        } else if (device.kind === 'audioinput') {
          audioInputs.push(device);
          if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
            this.audioInputDevices.set(device.deviceId, new AudioDeviceInfo(device));
          }
        } else if (device.kind === 'audiooutput') {
          audioOutputs.push(device);
          if (device.deviceId !== 'default' && device.deviceId !== 'communications') {
            this.audioOutputDevices.set(device.deviceId, new AudioDeviceInfo(device));
          }
        }
      }
      this.setDefaultInputDevice(audioInputs);
      this.setDefaultOutputDevice(audioOutputs);
    });
  }

  private setDefaultInputDevice(devices: MediaDeviceInfo[]) {
    const defaultDevice = devices.where(w => w.deviceId === 'default').select(s => s.label).first().substr('Default - '.length);
    const defaultComsDevice = devices.where(w => w.deviceId === 'communications').select(s => s.label).first().substr('Communications - '.length);

    this.audioInputDevices.where((w, s) => s.deviceLabel == defaultDevice).select((k, v) => v.isDefault = true);
    this.audioInputDevices.where((w, s) => s.deviceLabel == defaultComsDevice).select((k, v) => v.isCommunicationDefault = true);
  }

  private setDefaultOutputDevice(devices: MediaDeviceInfo[]) {
    const defaultDevice = devices.where(w => w.deviceId === 'default').select(s => s.label).first().substr('Default - '.length);
    const defaultComsDevice = devices.where(w => w.deviceId === 'communications').select(s => s.label).first().substr('Communications - '.length);

    this.audioOutputDevices.where((w, s) => s.deviceLabel == defaultDevice).select((k, v) => v.isDefault = true);
    this.audioOutputDevices.where((w, s) => s.deviceLabel == defaultComsDevice).select((k, v) => v.isCommunicationDefault = true);
  }

  public getVideoDeviceInfo = () => [...this.videoDevices.values()];
  public getAudioInputDeviceInfo = () => [...this.audioInputDevices.values()];
  public getAudioOutputDeviceInfo = () => [...this.audioOutputDevices.values()];
}
