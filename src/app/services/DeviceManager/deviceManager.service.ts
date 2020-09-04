import { Injectable } from '@angular/core';
import { AudioDevice, VideoDevice } from './mediaDevices';
import { ConfigurationService } from '../Configuration/configuration.service';
import '../../extensions';

@Injectable({
  providedIn: 'root',
})
export class DeviceManagerService {
  private videoDevices = new Map<string, VideoDevice>();
  private audioInputDevices = new Map<string, AudioDevice>();
  private audioOutputDevices = new Map<string, AudioDevice>();
  private errors: string[] = [];

  private currentVideoDevice: VideoDevice;
  public get CurrentVideoDevice(): VideoDevice {
    return this.currentVideoDevice;
  }

  private currentAudioInputDevice: AudioDevice;
  public get CurrentAudioInputDevice(): AudioDevice {
    return this.currentAudioInputDevice;
  }

  private currentAudioOutputDevice: AudioDevice;
  public get CurrentAudioOutputDevice(): AudioDevice {
    return this.currentAudioOutputDevice;
  }

  constructor(private configurationService: ConfigurationService) {
    this.ensureDevicePermissions()
      .then(() => {
        this.updateMediaDevices();
        navigator.mediaDevices.ondevicechange = () => {
          this.updateMediaDevices();
        };
      })
      .catch((err) => {
        this.errors.push(err);
        console.error(err);
      });
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

  private updateMediaDevices(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputs: MediaDeviceInfo[] = [];
      const audioOutputs: MediaDeviceInfo[] = [];

      for (const device of devices) {
        if (device.kind === 'videoinput') {
          this.videoDevices.set(device.deviceId, new VideoDevice(device));
        } else if (device.kind === 'audioinput') {
          audioInputs.push(device);
          if (
            device.deviceId !== 'default' &&
            device.deviceId !== 'communications'
          ) {
            this.audioInputDevices.set(
              device.deviceId,
              new AudioDevice(device)
            );
          }
        } else if (device.kind === 'audiooutput') {
          audioOutputs.push(device);
          if (
            device.deviceId !== 'default' &&
            device.deviceId !== 'communications'
          ) {
            this.audioOutputDevices.set(
              device.deviceId,
              new AudioDevice(device)
            );
          }
        }
      }
      this.setDefaultAudioDevices(audioInputs, this.audioInputDevices);
      this.setDefaultAudioDevices(audioOutputs, this.audioOutputDevices);
      this.configurationService.getConfiguration().then((config) => {
        if (config.videoDeviceId) {
          this.currentVideoDevice = this.videoDevices.first(
            (k, v) => v.deviceId === config.videoDeviceId
          )?.value;
        }

        if (config.audioInputId) {
          this.currentAudioInputDevice = this.audioInputDevices.first(
            (k, v) => v.deviceId === config.audioInputId
          )?.value;
        }

        if (config.audioOutputId) {
          this.currentAudioOutputDevice = this.audioOutputDevices.first(
            (k, v) => v.deviceId === config.audioOutputId
          )?.value;
        }

        if (!this.currentVideoDevice) {
          this.currentVideoDevice = this.videoDevices.first()?.value;
        }

        if (!this.currentAudioInputDevice) {
          this.currentAudioInputDevice =
            this.audioInputDevices.first(
              (k, v) => v.isCommunicationDefault === true
            )?.value ?? this.audioInputDevices.first()?.value;
        }

        if (!this.currentAudioOutputDevice) {
          this.currentAudioOutputDevice =
            this.audioOutputDevices.first(
              (k, v) => v.isCommunicationDefault === true
            )?.value ?? this.audioOutputDevices.first()?.value;
        }
      });
    });
  }

  private setDefaultAudioDevices(
    devices: MediaDeviceInfo[],
    audioDeviceMap: Map<string, AudioDevice>
  ): void {
    const defaultDeviceName = devices
      .where((w) => w.deviceId === 'default')
      .select((s) => s.label)
      .first()
      .substr('Default - '.length);
    const defaultComsDeviceName = devices
      .where((w) => w.deviceId === 'communications')
      .select((s) => s.label)
      .first()
      .substr('Communications - '.length);

    const defaultDevice = audioDeviceMap.first(
      (w, s) => s.deviceLabel === defaultDeviceName
    );
    if (defaultDevice) {
      defaultDevice.value.isDefault = true;
    }
    const defaultComsDevice = audioDeviceMap.first(
      (w, s) => s.deviceLabel === defaultComsDeviceName
    );
    if (defaultComsDevice) {
      defaultComsDevice.value.isCommunicationDefault = true;
    }
  }

  public getVideoDeviceInfo = () => [...this.videoDevices.values()];
  public getAudioInputDeviceInfo = () => [...this.audioInputDevices.values()];
  public getAudioOutputDeviceInfo = () => [...this.audioOutputDevices.values()];
}
