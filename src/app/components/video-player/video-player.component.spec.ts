import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingComponent } from './video-player.component';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';

const mockDeviceManager = {
  getVideoDevices: jest.fn(),
  getAudioInputDevices: jest.fn(),
  getAudioOutputDevices: jest.fn(),
  CurrentAudioInputDevice: null,
  CurrentAudioOutputDevice: null,
  CurrentVideoDevice: null,
};

describe('MeetingComponent', () => {
  let component: MeetingComponent;
  let fixture: ComponentFixture<MeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingComponent],
      providers: [
        {
          provide: DeviceManagerService,
          useFactory: () => mockDeviceManager,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
