import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerComponent } from './video-player.component';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';

describe('MeetingComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoPlayerComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
