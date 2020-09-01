import { TestBed } from '@angular/core/testing';

import { DeviceManagerService } from './deviceManager.service';

describe('DeviceManagerService', () => {
  let service: DeviceManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
