import {DoBootstrap, NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgRibbonWysiwygComponent} from "./components/ribbon/ng-ribbon-wysiwyg.component";
import {NgRibbonTextAreaComponent} from "./components/textarea/ng-ribbon-textarea.component";
import {NgRibbonHomeTabComponent} from "./components/ribbon/home-tab/ng-ribbon-home-tab.component";
import {SymbolListComponent} from "./components/ribbon/components/symbol-list.component";
import {NgRibbonModule} from "../../../ng-ribbon/src/lib/ng-ribbon.module";
import {MaterialModule} from "./material.module";
import {FormsModule} from "@angular/forms";
import {MenuTriggerDirective} from "./directives/menu-trigger.directive";
import {ColorSketchModule} from "ngx-color/sketch";
import {SplitButtonComponent} from "./components/ribbon/components/split-button.component";
import {ListButtonsComponent} from "./components/ribbon/home-tab/list-buttons.component";
import {IconsService} from "./services/icons.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgRibbonModule,
    MaterialModule,
    ColorSketchModule
  ],
  providers: [
    IconsService
  ],
  declarations: [
    NgRibbonWysiwygComponent,
    NgRibbonTextAreaComponent,
    NgRibbonHomeTabComponent,
    SplitButtonComponent,
    SymbolListComponent,
    ListButtonsComponent,
    MenuTriggerDirective
  ],
  exports: [
    NgRibbonWysiwygComponent,
    NgRibbonTextAreaComponent
  ]
})
export class NgRibbonWysiwygModule {

}
