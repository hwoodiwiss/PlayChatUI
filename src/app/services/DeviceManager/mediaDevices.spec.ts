import { TestBed } from '@angular/core/testing';
import { DeviceInfo } from './mediaDevices';

describe('DeviceInfo', () => {
  it('get isDefault will return the value of default', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const mediaDevice = new DeviceInfo(mediaDeviceInfo);
    (mediaDevice as any).default = true;
    expect(mediaDevice.isDefault).toBe(true);
    (mediaDevice as any).default = false;
    expect(mediaDevice.isDefault).toBe(false);
  });

  it('set isDefault will set default to the assigned value', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const mediaDevice = new DeviceInfo(mediaDeviceInfo);
    mediaDevice.isDefault = true;
    expect((mediaDevice as any).default).toBe(true);
    mediaDevice.isDefault = false;
    expect((mediaDevice as any).default).toBe(false);
  });

  it('get isCommunicationDefault will return the value of communicationDefault', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const mediaDevice = new DeviceInfo(mediaDeviceInfo);
    (mediaDevice as any).communicationDefault = true;
    expect(mediaDevice.isCommunicationDefault).toBe(true);
    (mediaDevice as any).communicationDefault = false;
    expect(mediaDevice.isCommunicationDefault).toBe(false);
  });

  it('set isCommunicationDefault will set communicationDefault to the assigned value', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const mediaDevice = new DeviceInfo(mediaDeviceInfo);
    mediaDevice.isCommunicationDefault = true;
    expect((mediaDevice as any).communicationDefault).toBe(true);
    mediaDevice.isCommunicationDefault = false;
    expect((mediaDevice as any).communicationDefault).toBe(false);
  });

  it('parseDeviceName will strip vendor id pairs from device labels', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test Id',
      groupId: 'Test Group',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'Test (1234:ABCD)',
      toJSON: () => 'No',
    };
    const mediaDevice = new DeviceInfo(mediaDeviceInfo);
    expect(mediaDevice.deviceName).toBe('Test');
    expect(mediaDevice.deviceLabel).toBe(mediaDeviceInfo.label);
  });
});
