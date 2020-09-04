import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsComponent } from './options.component';
import { DeviceManagerService } from 'src/app/services/DeviceManager/deviceManager.service';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  const mockDeviceManager = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsComponent],
      providers: [
        {
          provide: DeviceManagerService,
          fromValue: mockDeviceManager,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
