import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {FormsModule} from "@angular/forms";
import {NgRibbonModule} from "../../projects/ng-ribbon/src/lib/ng-ribbon.module";
import {NgRibbonWysiwygModule} from "../../projects/ng-ribbon-wysiwyg/src/lib/ng-ribbon-wysiwyg.module";
import {FileMenuComponent} from "./components/file-menu.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    NgRibbonModule,
    NgRibbonWysiwygModule
  ],
  providers: [],
  declarations: [
    AppComponent,
    FileMenuComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
