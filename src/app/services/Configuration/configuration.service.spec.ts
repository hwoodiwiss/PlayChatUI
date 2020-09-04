import { TestBed } from '@angular/core/testing';
import { ConfigurationService, CFG_KEY } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  const mockLocalStorage = {
    getItem: jest.fn(),
    length: 0,
    clear: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getConfiguration should return cached config object if not null', async () => {
    const expectedConfig = {
      videoDeviceId: 'VidDev',
      audioInputId: 'AudInId',
      audioOutputId: 'AudOutId',
    };
    (service as any).config = expectedConfig;
    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual(expectedConfig);
  });

  it('getConfiguration should return config from localStorage if config is null', async () => {
    const expectedConfig = {
      videoDeviceId: 'VidDev',
      audioInputId: 'AudInId',
      audioOutputId: 'AudOutId',
    };
    const expectedJson = JSON.stringify(expectedConfig);
    const expectedB64 = btoa(expectedJson);

    Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });
    mockLocalStorage.getItem.mockReturnValue(expectedB64);

    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual(expectedConfig);
  });
});
