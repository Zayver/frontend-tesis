import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

//Primeng Components
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SliderModule,
    BrowserAnimationsModule,
    FormsModule,
    FileUploadModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
