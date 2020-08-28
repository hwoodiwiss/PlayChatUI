import { TestBed } from '@angular/core/testing';

import { WebRTCServiceService } from './WebRtcService.service';

describe('WebRTCServiceService', () =>
{
  let service: WebRTCServiceService;

  beforeEach(() =>
  {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRTCServiceService);
  });

  it('should be created', () =>
  {
    expect(service).toBeTruthy();
  });
});
