import { TestBed } from '@angular/core/testing';
import { ConfigurationService, CFG_KEY } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationService);
    global.localStorage.removeItem(CFG_KEY);
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

    global.localStorage.setItem(CFG_KEY, expectedB64);

    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual(expectedConfig);
  });

  it('getConfiguration should return empty object if no value is present in localStorage', async () => {
    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual({});
  });

  it('getConfiguration should return empty object if value in localStorage is invalid base64', async () => {
    const expectedB64 = 'asdf#][]';

    global.localStorage.setItem(CFG_KEY, expectedB64);

    const errorSpy = jest.spyOn(console, 'error');

    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual({});
    expect(errorSpy).toBeCalled();
  });

  it('getConfiguration should return empty object if value in localStorage is invalid json', async () => {
    const expectedB64 = btoa('Some non-json value');

    global.localStorage.setItem(CFG_KEY, expectedB64);

    const errorSpy = jest.spyOn(console, 'error');

    const actualConfig = await service.getConfiguration();
    expect(actualConfig).toEqual({});
    expect(errorSpy).toBeCalled();
  });

  it('updateConfig should store config to localStorage', async () => {
    const expectedConfig = {
      videoDeviceId: 'VidDev',
      audioInputId: 'AudInId',
      audioOutputId: 'AudOutId',
    };
    const expectedJson = JSON.stringify(expectedConfig);
    const expectedB64 = btoa(expectedJson);
    (service as any).config = expectedConfig;
    service.updateConfig();

    const actualB64 = global.localStorage.getItem(CFG_KEY);

    expect(actualB64).toEqual(expectedB64);
  });

  it('updateConfig should initialize config if it is falsy', async () => {
    const expectedJson = JSON.stringify({});
    const expectedB64 = btoa(expectedJson);
    (service as any).config = undefined;
    service.updateConfig();

    const actualB64 = global.localStorage.getItem(CFG_KEY);

    expect(actualB64).toEqual(expectedB64);
  });
});
