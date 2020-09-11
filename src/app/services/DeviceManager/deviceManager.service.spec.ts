import { TestBed } from '@angular/core/testing';

import { DeviceManagerService } from './deviceManager.service';
import { ConfigurationService } from '../Configuration/configuration.service';
import { VideoDevice, AudioDevice } from './mediaDevices';

describe('DeviceManagerService', () => {
  const testMediaDevices = [
    {
      deviceId: '1',
      groupId: '1',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'AI1',
      toJSON: () => 'No',
    },
    {
      deviceId: 'default',
      groupId: '1',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'Default - AI1',
      toJSON: () => 'No',
    },
    {
      deviceId: 'communications',
      groupId: '1',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'Communications - AI1',
      toJSON: () => 'No',
    },
    {
      deviceId: '2',
      groupId: '2',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'AI2',
      toJSON: () => 'No',
    },
    {
      deviceId: '1',
      groupId: '1',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'AO1',
      toJSON: () => 'No',
    },
    {
      deviceId: 'default',
      groupId: '1',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'Default - AO1',
      toJSON: () => 'No',
    },
    {
      deviceId: 'communications',
      groupId: '1',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'Communications - AO2',
      toJSON: () => 'No',
    },
    {
      deviceId: '2',
      groupId: '2',
      kind: 'audiooutput' as MediaDeviceKind,
      label: 'AO2',
      toJSON: () => 'No',
    },
    {
      deviceId: '1',
      groupId: '1',
      kind: 'videoinput' as MediaDeviceKind,
      label: 'VI1',
      toJSON: () => 'No',
    },
    {
      deviceId: '2',
      groupId: '1',
      kind: 'videoinput' as MediaDeviceKind,
      label: 'VI2',
      toJSON: () => 'No',
    },
  ];

  const grantedPermissionState = { state: 'granted' };
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

  it('ctor should call init', () => {
    const initSpy = jest.spyOn(DeviceManagerService.prototype, 'init');
    const ctorService = new DeviceManagerService(mockConfigurationService as any);
    expect(initSpy).toBeCalled();
  });

  it('init should updateDeviceArrays if ensureDevicePermissions is success', async () => {
    service.ensureDevicePermissions = jest.fn();
    (service.ensureDevicePermissions as jest.Mock<any, any>).mockResolvedValue(null);
    (service as any).updateMediaDevices = jest.fn();
    await service.init();
    expect((service as any).updateMediaDevices).toBeCalled();
  });

  it('init should catch errors and add to errors array', async () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    await service.init();
    expect((service as any).errors).toHaveLength(1);
  });

  it('ensureDevicePermissions should throw if mic permission denied', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });

  it('ensureDevicePermissions should throw if mic permission request ignored', () => {
    const permissionStatus = { state: 'prompt' };
    mockPermissions.query.mockReturnValue(permissionStatus);
    mockMediaDevices.getUserMedia.mockRejectedValue('no');
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });

  it('ensureDevicePermissions should throw if camera permission denied', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockReturnValue(permissionStatus).mockReturnValueOnce(grantedPermissionState);
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });

  it('ensureDevicePermissions should throw if camera permission request ignored', () => {
    const permissionStatus = { state: 'prompt' };
    mockPermissions.query.mockReturnValue(permissionStatus).mockReturnValueOnce(grantedPermissionState);
    mockMediaDevices.getUserMedia.mockRejectedValue('no');
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toBeTruthy();
    });
  });

  it('upateMediaDevices populates the three device arrays', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();

    const audioInputs = service.getAudioInputDeviceInfo();
    expect(audioInputs).toHaveLength(2);
    expect(audioInputs[0].deviceId).toBe('1');
    expect(audioInputs[0].isDefault).toBe(true);
    expect(audioInputs[0].isCommunicationDefault).toBe(true);
    expect(audioInputs[1].deviceId).toBe('2');
    expect(audioInputs[1].isDefault).toBe(false);
    expect(audioInputs[1].isCommunicationDefault).toBe(false);

    const audioOutputs = service.getAudioOutputDeviceInfo();
    expect(audioOutputs).toHaveLength(2);
    expect(audioOutputs[0].deviceId).toBe('1');
    expect(audioOutputs[0].isDefault).toBe(true);
    expect(audioOutputs[0].isCommunicationDefault).toBe(false);
    expect(audioOutputs[1].deviceId).toBe('2');
    expect(audioOutputs[1].isDefault).toBe(false);
    expect(audioOutputs[1].isCommunicationDefault).toBe(true);

    const videoInputs = service.getVideoDeviceInfo();
    expect(videoInputs).toHaveLength(2);
    expect(videoInputs[0].deviceName).toBe('VI1');
    expect(videoInputs[1].deviceName).toBe('VI2');
  });

  it('updateMediaDevices sets the current audio devices to the audio device matching id in config', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    const testConfig = {
      audioInputId: '2',
      audioOutputId: '1',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();
    expect(service.CurrentAudioInputDevice.deviceId).toBe('2');
    expect(service.CurrentAudioOutputDevice.deviceId).toBe('1');
  });

  it('updateMediaDevices sets the current video device to the video device matching id in config', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    const testConfig = {
      videoDeviceId: '2',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();
    expect(service.CurrentVideoDevice.deviceId).toBe('2');
  });

  it('updateMediaDevices sets the current audio devices to communication defaults if config is empty', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    const testConfig = {
      audioOutputId: null,
      audioInputId: null,
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();
    expect(service.CurrentAudioInputDevice.deviceId).toBe('1');
    expect(service.CurrentAudioOutputDevice.deviceId).toBe('2');
  });

  it('updateMediaDevices sets the current video device to the first in the videoDevices collection if config is empty', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    const testConfig = {
      videoDeviceId: null,
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();
    expect(service.CurrentVideoDevice.deviceId).toBe('1');
  });
});
