import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingComponent } from './meeting.component';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';
import { VideoPlayerModule } from '../video-player/video-player.module';
import { WebRTCService } from 'src/app/services/WebRTC/webRtc.service';

const mockDeviceManager = {
  getVideoDevices: jest.fn(),
  getAudioInputDevices: jest.fn(),
  getAudioOutputDevices: jest.fn(),
  CurrentAudioInputDevice: null,
  CurrentAudioOutputDevice: null,
  CurrentVideoDevice: null,
};

const mockWebRtcService = {
  remoteVideoStream: [],
};

describe('MeetingComponent', () => {
  let component: MeetingComponent;
  let fixture: ComponentFixture<MeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingComponent],
      imports: [VideoPlayerModule],
      providers: [
        {
          provide: DeviceManagerService,
          useFactory: () => mockDeviceManager,
        },
        {
          provide: WebRTCService,
          useFactory: () => mockWebRtcService,
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
