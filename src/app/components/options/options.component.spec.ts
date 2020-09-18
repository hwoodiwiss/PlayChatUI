import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { OptionsComponent } from './options.component';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  const mockDeviceManager = {
    updateMediaDevices: jest.fn(),
    getVideoDevices: jest.fn(),
    getAudioInputDevices: jest.fn(),
    getAudioOutputDevices: jest.fn(),
    CurrentAudioInputDevice: null,
    CurrentAudioOutputDevice: null,
    CurrentVideoDevice: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      declarations: [OptionsComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: DeviceManagerService,
          useFactory: () => mockDeviceManager,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngInit should update the deviceManager, then set selected device ids to current device ids', async () => {
    mockDeviceManager.updateMediaDevices.mockImplementation(async () => {
      mockDeviceManager.CurrentAudioInputDevice = { deviceId: 'input' };
      mockDeviceManager.CurrentAudioOutputDevice = { deviceId: 'output' };
      mockDeviceManager.CurrentVideoDevice = { deviceId: 'video' };
    });
    await component.ngOnInit();
    expect(mockDeviceManager.updateMediaDevices).toBeCalled();
    expect(component.selectedAudioInputId).toBe('input');
    expect(component.selectedAudioOutputId).toBe('output');
    expect(component.selectedVideoDeviceId).toBe('video');
  });

  it('getCurrentAudioInputDevice will return deviceManager CurrentAudioInputDevice', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.CurrentAudioInputDevice = expectedValue;
    expect(component.getCurrentAudioInputDevice()).toBe(expectedValue);
  });

  it('getCurrentAudioOutputDevice will return deviceManager CurrentAudioOutputDevice', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.CurrentAudioOutputDevice = expectedValue;
    expect(component.getCurrentAudioOutputDevice()).toBe(expectedValue);
  });

  it('getCurrentVideoDevice will return deviceManager CurrentVideoDevice', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.CurrentVideoDevice = expectedValue;
    expect(component.getCurrentVideoDevice()).toBe(expectedValue);
  });

  it('updateAudioInput will set CurrentAudioInputDevice to be an input device with id matching selectedAudioInputId', () => {
    const expectedDevice = { deviceId: 'thisOne' };
    const inputDevices = [{ deviceId: 'notThis' }, expectedDevice];
    mockDeviceManager.getAudioInputDevices.mockReturnValue(inputDevices);
    component.selectedAudioInputId = 'thisOne';
    component.updateAudioInput();
    expect(mockDeviceManager.CurrentAudioInputDevice).toBe(expectedDevice);
  });

  it('updateAudioOutput will set CurrentAudioOutputDevice to be an input device with id matching selectedAudioOutputId', () => {
    const expectedDevice = { deviceId: 'thisOne' };
    const outputDevices = [{ deviceId: 'notThis' }, expectedDevice];
    mockDeviceManager.getAudioOutputDevices.mockReturnValue(outputDevices);
    component.selectedAudioOutputId = 'thisOne';
    component.updateAudioOutput();
    expect(mockDeviceManager.CurrentAudioOutputDevice).toBe(expectedDevice);
  });

  it('updateVideoDevice will set CurrentVideoDevice to be an input device with id matching selectedVideoDeviceId', () => {
    const expectedDevice = { deviceId: 'thisOne' };
    const videoDevices = [{ deviceId: 'notThis' }, expectedDevice];
    mockDeviceManager.getVideoDevices.mockReturnValue(videoDevices);
    component.selectedVideoDeviceId = 'thisOne';
    component.updateVideoDevice();
    expect(mockDeviceManager.CurrentVideoDevice).toBe(expectedDevice);
  });
});
