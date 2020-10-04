import { TestBed } from '@angular/core/testing';

import { DeviceManagerService } from './deviceManager.service';
import { ConfigurationService } from '../Configuration/configuration.service';
import { VideoDevice, AudioInputDevice, AudioOutputDevice } from './mediaDevices';

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

  const testMediaDevicesNoDefaults = [
    {
      deviceId: '1',
      groupId: '1',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'AI1',
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
    addEventListener: jest.fn(),
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
      addEventListener: jest.fn(),
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
    (service as any).currentAudioInputDevice = new AudioInputDevice(mediaDeviceInfo);
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
    (service as any).currentAudioOutputDevice = new AudioOutputDevice(mediaDeviceInfo);
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
    const expectedDevice = new AudioInputDevice(mediaDeviceInfo);
    service.CurrentAudioOutputDevice = expectedDevice;
    expect(service.CurrentAudioOutputDevice).toBe(expectedDevice);
    expect(mockConfigurationService.updateConfig).toBeCalled();
    expect(testConfig.audioOutputId).toBe(expectedDeviceId);
  });

  it('set CurrentAudioInputDevice should store the selected id in configuration', () => {
    const testConfig = {
      audioInputId: 'not set',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    const expectedDeviceId = 'TestDevice123';
    const mediaDeviceInfo = {
      deviceId: expectedDeviceId,
      groupId: 'Test',
      kind: 'audioinput' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const expectedDevice = new AudioInputDevice(mediaDeviceInfo);
    service.CurrentAudioInputDevice = expectedDevice;
    expect(service.CurrentAudioInputDevice).toBe(expectedDevice);
    expect(mockConfigurationService.updateConfig).toBeCalled();
    expect(testConfig.audioInputId).toBe(expectedDeviceId);
  });

  it('set CurrentVideoDevice should store the selected id in configuration', () => {
    const testConfig = {
      videoDeviceId: 'not set',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    const expectedDeviceId = 'TestDevice123';
    const mediaDeviceInfo = {
      deviceId: expectedDeviceId,
      groupId: 'Test',
      kind: 'videodevice' as MediaDeviceKind,
      label: 'TestLabel',
      toJSON: () => 'No',
    };
    const expectedDevice = new VideoDevice(mediaDeviceInfo);
    service.CurrentVideoDevice = expectedDevice;
    expect(service.CurrentVideoDevice).toBe(expectedDevice);
    expect(mockConfigurationService.updateConfig).toBeCalled();
    expect(testConfig.videoDeviceId).toBe(expectedDeviceId);
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
    mockPermissions.query.mockResolvedValue(permissionStatus);
    await service.init();
    expect((service as any).errors).toHaveLength(1);
  });

  it('ensureDevicePermissions should throw if mic permission denied', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockResolvedValue(permissionStatus);
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toEqual(new Error('This application requires mic access to function.'));
    });
  });

  it('ensureDevicePermissions should throw if mic permission request ignored', () => {
    const permissionStatus = { state: 'prompt' };
    mockPermissions.query.mockResolvedValue(permissionStatus);
    mockMediaDevices.getUserMedia.mockRejectedValue(new Error('no'));
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toEqual(new Error('This application requires mic access to function.'));
    });
  });

  it('ensureDevicePermissions should throw if camera permission denied', () => {
    const permissionStatus = { state: 'denied' };
    mockPermissions.query.mockResolvedValue(permissionStatus).mockReturnValueOnce(grantedPermissionState);
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toEqual(new Error('This application requires camera access to function.'));
    });
  });

  it('ensureDevicePermissions should throw if camera permission request ignored', () => {
    const permissionStatus = { state: 'prompt' };
    mockPermissions.query.mockResolvedValue(permissionStatus).mockReturnValueOnce(grantedPermissionState);
    mockMediaDevices.getUserMedia.mockRejectedValue(new Error('no'));
    service.ensureDevicePermissions().catch((reason) => {
      expect(reason).toEqual(new Error('This application requires camera access to function.'));
    });
  });

  it('ensureDevicePermissions should resolve if mic and camera permissions are granted', () => {
    mockPermissions.query.mockResolvedValue(grantedPermissionState);
    expect(service.ensureDevicePermissions()).resolves.toBe(undefined);
  });

  it('updateMediaDevices ignores non-audioinput, audiooutput or video devices', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    mockConfigurationService.getConfiguration.mockReturnValue({});
    mockMediaDevices.enumerateDevices.mockResolvedValue([
      {
        deviceId: '2',
        groupId: '1',
        kind: 'invaliddevice',
        label: 'VI2',
        toJSON: () => 'No',
      },
    ]);
    await service[updateMediaDevicesKey]();
    expect(service.getAudioInputDevices().length).toBe(0);
    expect(service.getAudioOutputDevices().length).toBe(0);
    expect(service.getVideoDevices().length).toBe(0);
  });

  it('upateMediaDevices populates the three device arrays, and sets current device to default if no config is present', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    mockConfigurationService.getConfiguration.mockReturnValue({});
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service[updateMediaDevicesKey]();

    const audioInputs = service.getAudioInputDevices();
    expect(audioInputs).toHaveLength(2);
    expect(audioInputs[0].deviceId).toBe('1');
    expect(audioInputs[0].isDefault).toBe(true);
    expect(audioInputs[0].isCommunicationDefault).toBe(true);
    expect(audioInputs[1].deviceId).toBe('2');
    expect(audioInputs[1].isDefault).toBe(false);
    expect(audioInputs[1].isCommunicationDefault).toBe(false);

    const audioOutputs = service.getAudioOutputDevices();
    expect(audioOutputs).toHaveLength(2);
    expect(audioOutputs[0].deviceId).toBe('1');
    expect(audioOutputs[0].isDefault).toBe(true);
    expect(audioOutputs[0].isCommunicationDefault).toBe(false);
    expect(audioOutputs[1].deviceId).toBe('2');
    expect(audioOutputs[1].isDefault).toBe(false);
    expect(audioOutputs[1].isCommunicationDefault).toBe(true);

    const videoInputs = service.getVideoDevices();
    expect(videoInputs).toHaveLength(2);
    expect(videoInputs[0].deviceName).toBe('VI1');
    expect(videoInputs[1].deviceName).toBe('VI2');
  });

  it('upateMediaDevices populates the three device arrays, and sets current device to the first entry if no defaults or config are present', async () => {
    const updateMediaDevicesKey = 'updateMediaDevices';
    mockConfigurationService.getConfiguration.mockReturnValue({});
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevicesNoDefaults);
    await service[updateMediaDevicesKey]();

    const audioInputs = service.getAudioInputDevices();
    expect(audioInputs).toHaveLength(2);
    expect(audioInputs[0].deviceId).toBe('1');
    expect(audioInputs[0].isDefault).toBe(false);
    expect(audioInputs[0].isCommunicationDefault).toBe(false);
    expect(audioInputs[1].deviceId).toBe('2');
    expect(audioInputs[1].isDefault).toBe(false);
    expect(audioInputs[1].isCommunicationDefault).toBe(false);
    expect(service.CurrentAudioInputDevice).toBe(audioInputs[0]);

    const audioOutputs = service.getAudioOutputDevices();
    expect(audioOutputs).toHaveLength(2);
    expect(audioOutputs[0].deviceId).toBe('1');
    expect(audioOutputs[0].isDefault).toBe(false);
    expect(audioOutputs[0].isCommunicationDefault).toBe(false);
    expect(audioOutputs[1].deviceId).toBe('2');
    expect(audioOutputs[1].isDefault).toBe(false);
    expect(audioOutputs[1].isCommunicationDefault).toBe(false);
    expect(service.CurrentAudioOutputDevice).toBe(audioOutputs[0]);

    const videoInputs = service.getVideoDevices();
    expect(videoInputs).toHaveLength(2);
    expect(videoInputs[0].deviceName).toBe('VI1');
    expect(videoInputs[1].deviceName).toBe('VI2');
  });

  it('updateMediaDevices sets the current audio devices to the audio device matching id in config', async () => {
    const testConfig = {
      audioInputId: '2',
      audioOutputId: '1',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service.updateMediaDevices();
    expect(service.CurrentAudioInputDevice.deviceId).toBe('2');
    expect(service.CurrentAudioOutputDevice.deviceId).toBe('1');
  });

  it('updateMediaDevices sets the current video device to the video device matching id in config', async () => {
    const testConfig = {
      videoDeviceId: '2',
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service.updateMediaDevices();
    expect(service.CurrentVideoDevice.deviceId).toBe('2');
  });

  it('updateMediaDevices sets the current audio devices to communication defaults if config is empty', async () => {
    const testConfig = {
      audioOutputId: null,
      audioInputId: null,
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service.updateMediaDevices();
    expect(service.CurrentAudioInputDevice.deviceId).toBe('1');
    expect(service.CurrentAudioOutputDevice.deviceId).toBe('2');
  });

  it('updateMediaDevices sets the current video device to the first in the videoDevices collection if config is empty', async () => {
    const testConfig = {
      videoDeviceId: null,
    };

    mockConfigurationService.getConfiguration.mockReturnValue(testConfig);
    mockMediaDevices.enumerateDevices.mockResolvedValue(testMediaDevices);
    await service.updateMediaDevices();
    expect(service.CurrentVideoDevice.deviceId).toBe('1');
  });

  it('deviceChangeHandler will call updateMediaDevices then trigger next on DevicesChanged', async () => {
    const devicesChangedKey = 'devicesChanged';
    const deviceChangeHandlerKey = 'deviceChangeHandler';
    service.updateMediaDevices = jest.fn();
    const devicesChangedNextSpy = jest.spyOn(service[devicesChangedKey], 'next');
    await service[deviceChangeHandlerKey]();
    expect(service.updateMediaDevices).toBeCalled();
    expect(devicesChangedNextSpy).toBeCalled();
  });

  it('onDevicesChanged should add a subbscriber function to devicesChanged', () => {
    const devicesChangedKey = 'devicesChanged';
    const devicesChangedSubSpy = jest.spyOn(service[devicesChangedKey], 'subscribe');
    const expectedFunc = () => {
      console.log('This is a test closure');
    };
    service.onDevicesChanged(expectedFunc);
    expect(devicesChangedSubSpy).toBeCalledWith(expectedFunc);
  });
});
