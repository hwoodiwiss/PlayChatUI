import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { OptionsComponent } from './options.component';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  let mockDeviceManager;

  beforeEach(() => {
    mockDeviceManager = {
      getVideoDeviceInfo: jest.fn(),
      getAudioInputDeviceInfo: jest.fn(),
      getAudioOutputDeviceInfo: jest.fn(),
      CurrentAudioInputDevice: null,
      CurrentAudioOutputDevice: null,
      CurrentVideoDevice: null,
    };

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

  it('getAudioInputDevices will return deviceManager getAudioInputDeviceInfo', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.getAudioInputDeviceInfo.mockReturnValue(expectedValue);
    expect(component.getAudioInputDevices()).toBe(expectedValue);
  });

  it('getAudioOutputDevices will return deviceManager getAudioOutputDeviceInfo', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.getAudioOutputDeviceInfo.mockReturnValue(expectedValue);
    expect(component.getAudioOutputDevices()).toBe(expectedValue);
  });

  it('getVideoDevices will return deviceManager getVideoDeviceInfo', () => {
    const expectedValue = 'Test Return Value';
    mockDeviceManager.getVideoDeviceInfo.mockReturnValue(expectedValue);
    expect(component.getVideoDevices()).toBe(expectedValue);
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
});
