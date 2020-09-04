import { TestBed } from '@angular/core/testing';

import { DeviceManagerService } from './deviceManager.service';
import { ConfigurationService } from '../Configuration/configuration.service';

describe('DeviceManagerService', () => {
  let service: DeviceManagerService;
  const configurationService = {
    getConfiguration: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigurationService,
          useValue: configurationService,
        },
      ],
    });
    service = TestBed.inject(DeviceManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
