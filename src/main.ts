import { enableProdMode, importProvidersFrom } from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';


import {environment} from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgRibbonWysiwygModule } from '../projects/ng-ribbon-wysiwyg/src/lib/ng-ribbon-wysiwyg.module';
import { AppComponent } from './app/components/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, NgRibbonWysiwygModule),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
