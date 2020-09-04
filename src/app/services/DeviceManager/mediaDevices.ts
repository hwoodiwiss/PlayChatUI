export class DeviceInfo {
  private default: boolean;

  public set isDefault(value: boolean) {
    this.default = value;
  }
  public get isDefault(): boolean {
    return this.default;
  }

  private communicationDefault: boolean;

  public set isCommunicationDefault(value: boolean) {
    this.communicationDefault = value;
  }
  public get isCommunicationDefault(): boolean {
    return this.communicationDefault;
  }

  public readonly deviceLabel: string;
  public readonly deviceName: string;
  public readonly deviceId: string;

  constructor(private mediaDeviceInfo: MediaDeviceInfo) {
    this.deviceLabel = mediaDeviceInfo.label;
    this.deviceName = this.parseDeviceName(mediaDeviceInfo.label);
    this.deviceId = mediaDeviceInfo.deviceId;
  }

  parseDeviceName(deviceName: string): string {
    return deviceName.replace(/\([0-9a-fA-F]{4}:[0-9a-fA-F]{4}\)/g, '').trim();
  }
}

export class VideoDevice extends DeviceInfo {}

export class AudioDevice extends DeviceInfo {}
