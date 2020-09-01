import { Injectable } from '@angular/core';
import { Configuration } from './Configuration'

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: Configuration;

  constructor() { }

  getConfiguration(): Configuration {
    if (this.config) {
      return this.config;
    }

  }

}
