import { Injectable } from '@angular/core';
import { AudioDeviceInfo, VideoDeviceInfo } from './mediaDevices'


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
      for (const device of devices) {
        if (device.kind == 'videoinput') {
          this.videoDevices.set(device.deviceId, new VideoDeviceInfo(device));
        } else {

          if (device.kind == 'audioinput') {
            this.audioInputDevices.set(device.deviceId, new AudioDeviceInfo(device));
          } else if (device.kind == 'audiooutput') {
            this.audioOutputDevices.set(device.deviceId, new AudioDeviceInfo(device));
          }
        }
      }
    });
  }


  public getVideoDeviceInfo = () => [...this.videoDevices.values()];
  public getAudioInputDeviceInfo = () => [...this.audioInputDevices.values()];
  public getAudioOutputDeviceInfo = () => [...this.audioOutputDevices.values()];
}
