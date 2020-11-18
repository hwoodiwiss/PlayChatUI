import { TestBed } from '@angular/core/testing';

import { WebRTCService } from './webRtc.service';

describe('WebRTCService', () => {
  let service: WebRTCService;
  const mockVideoStream: MediaStream = {
    id: 'VideoStream',
    getVideoTracks: jest.fn(),
  } as any;
  const mockAudioStream: MediaStream = {
    id: 'AudioStream',
    getVideoTracks: jest.fn(),
  } as any;
  const mediaStreamsKey = 'mediaStreams';

  const mockStreamsData: MediaStream[] = [mockVideoStream, mockAudioStream];

  beforeEach(() => {
    jest.resetAllMocks();
    (mockVideoStream.getVideoTracks as jest.Mock<any, any>).mockReturnValue(['a value']);
    (mockAudioStream.getVideoTracks as jest.Mock<any, any>).mockReturnValue(null);
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRTCService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });

  it('get VideoStreams should return all media streams that contain at least 1 video track', async () => {
    service[mediaStreamsKey] = mockStreamsData;
    const actualStreams = service.VideoStreams;
    expect(actualStreams).toHaveLength(1);
    expect(actualStreams[0]).toEqual(mockVideoStream);
  });

  it('get VideoStreams should return an empty array if service.mediaStreams is null', async () => {
    const actualStreams = service.VideoStreams;
    expect(actualStreams).toHaveLength(0);
    expect(actualStreams).toEqual([]);
  });
});
