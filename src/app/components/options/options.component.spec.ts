import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { OptionsComponent } from './options.component';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  const mockDeviceManager = {
    getVideoDeviceInfo: jest.fn(),
    getAudioInputDeviceInfo: jest.fn(),
    getAudioOutputDeviceInfo: jest.fn(),
    CurrentAudioInputDevice: null,
    CurrentAudioOutputDevice: null,
    CurrentVideoDevice: null,
  };

  beforeEach(() => {
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
});
