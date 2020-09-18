import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OptionsComponent } from './options.component';

@NgModule({
  declarations: [OptionsComponent],
  imports: [BrowserModule, FormsModule],
  exports: [OptionsComponent],
})
export class OptionsModule {}
