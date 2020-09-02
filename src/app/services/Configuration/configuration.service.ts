import { Injectable } from '@angular/core';
import { Configuration } from './Configuration';

const CFG_KEY = 'pc-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private config: Configuration;

  constructor() {}

  async getConfiguration(): Promise<Configuration> {
    if (this.config) {
      return this.config;
    }
    this.config = this.readConfig();
    return this.config;
  }

  private readConfig(): Configuration {
    const localConfigEncoded = localStorage.getItem(CFG_KEY);

    if (localConfigEncoded !== null) {
      try {
        const localStorageDecoded = atob(localConfigEncoded);
        const localConfigObj: Configuration = JSON.parse(localStorageDecoded);
        return localConfigObj;
      } catch {
        console.error('An error occcured reading local configuration.');
      }
    }

    return new Configuration();
  }

  public updateConfig(): void {
    if (!this.config) {
      this.config = new Configuration();
    }

    const configJson = JSON.stringify(this.config);
    const encodedConfig = btoa(configJson);
    localStorage.setItem(CFG_KEY, encodedConfig);
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
