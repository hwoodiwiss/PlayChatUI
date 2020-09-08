import { TestBed } from '@angular/core/testing';

import { DeviceManagerService } from './deviceManager.service';
import { ConfigurationService } from '../Configuration/configuration.service';
import { VideoDevice, AudioDevice } from './mediaDevices';

describe('DeviceManagerService', () => {
  let service: DeviceManagerService;
  let mockConfigurationService = {
    getConfiguration: jest.fn(),
    updateConfig: jest.fn(),
  };
  let mockPermissions = {
    query: jest.fn(),
  };
  let mockMediaDevices = {
    getUserMedia: jest.fn(),
    enumerateDevices: jest.fn(),
  };

  beforeEach(() => {
    mockConfigurationService = {
      getConfiguration: jest.fn(),
      updateConfig: jest.fn(),
    };
    mockPermissions = {
      query: jest.fn(),
    };
    mockMediaDevices = {
      getUserMedia: jest.fn(),
      enumerateDevices: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigurationService,
          useValue: mockConfigurationService,
        },
      ],
    });
    service = TestBed.inject(DeviceManagerService);
    (global.navigator as any).permissions = mockPermissions;
    (global.navigator as any).mediaDevices = mockMediaDevices;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get CurrentVideoDevice should return currentVideoDevice', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'videoinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    (service as any).currentVideoDevice = new VideoDevice(mediaDeviceInfo);
    const actual = service.CurrentVideoDevice;
    expect(actual).toBeTruthy();
    expect(actual.deviceId).toBe('Test');
  });

  it('get CurrentAudioInputDevice should return currentAudioInputDevice', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    (service as any).currentAudioInputDevice = new AudioDevice(mediaDeviceInfo);
    const actual = service.CurrentAudioInputDevice;
    expect(actual).toBeTruthy();
    expect(actual.deviceId).toBe('Test');
  });

  it('get CurrentAudioOutputDevice should return currentAudioOutputDevice', () => {
    const mediaDeviceInfo = {
      deviceId: 'Test',
      groupId: 'Test',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    (service as any).currentAudioOutputDevice = new AudioDevice(mediaDeviceInfo);
    const actual = service.CurrentAudioOutputDevice;
    expect(actual).toBeTruthy();
    expect(actual.deviceId).toBe('Test');
  });

  it('set CurrentAudioOutputDevice should store the selected id in configuration', () => {
    const testConfig = {
      audioOutputId: 'not set',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    const expectedDeviceId = 'TestDevice123';
    const mediaDeviceInfo = {
      deviceId: expectedDeviceId,
      groupId: 'Test',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const expectedDevice = new AudioDevice(mediaDeviceInfo);
    service.CurrentAudioOutputDevice = expectedDevice;
    expect(service.CurrentAudioOutputDevice).toBe(expectedDevice);
    expect(mockConfigurationService.updateConfig).toBeCalled();
    expect(testConfig.audioOutputId).toBe(expectedDeviceId);
  });

  it('ctor should catch errors and add to errors array', async () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    const ctorService = await new DeviceManagerService(mockConfigurationService as any);
    expect((ctorService as any).errors).toHaveLength(1);
  });

  it('ensureDevicePermissions should throw if mic permission denied', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });

  it('ensureDevicePermissions should throw if mic permission request ignored', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    mockMediaDevices.getUserMedia.mockRejectedValue('no');
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });
});
