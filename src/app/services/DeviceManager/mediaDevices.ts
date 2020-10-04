export class Device {
  private default = false;

  public set isDefault(value: boolean) {
    this.default = value;
  }
  public get isDefault(): boolean {
    return this.default;
  }

  private communicationDefault = false;

  public set isCommunicationDefault(value: boolean) {
    this.communicationDefault = value;
  }
  public get isCommunicationDefault(): boolean {
    return this.communicationDefault;
  }

  public readonly deviceLabel: string;
  public readonly deviceName: string;
  public readonly deviceId: string;

  constructor(protected mediaDeviceInfo: MediaDeviceInfo) {
    this.deviceLabel = mediaDeviceInfo.label;
    this.deviceName = this.parseDeviceName(mediaDeviceInfo.label);
    this.deviceId = mediaDeviceInfo.deviceId;
  }

  parseDeviceName(deviceName: string): string {
    return deviceName.replace(/\([0-9a-fA-F]{4}:[0-9a-fA-F]{4}\)/g, '').trim();
  }
}

export class VideoDevice extends Device {
  async getVideoStream(width: number, height: number): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: { advanced: [{ deviceId: this.deviceId, width, height }] } });
  }
}

export class AudioOutputDevice extends Device {}
export class AudioInputDevice extends Device {}
