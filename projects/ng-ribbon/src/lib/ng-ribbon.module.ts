import {NgModule} from '@angular/core';
import {NgRibbonComponent} from './components/ng-ribbon/ng-ribbon.component';
import {NgRibbonGroupComponent} from "./components/ng-ribbon-group/ng-ribbon-group.component";
import {NgRibbonTabComponent} from "./components/ng-ribbon-tab/ng-ribbon-tab.component";
import {CommonModule} from "@angular/common";
import {NgRibbonContextComponent} from "./components/ng-ribbon-context/ng-ribbon-context.component";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgRibbonComponent,
    NgRibbonContextComponent,
    NgRibbonTabComponent,
    NgRibbonGroupComponent
  ],
  exports: [
    NgRibbonComponent,
    NgRibbonContextComponent,
    NgRibbonTabComponent,
    NgRibbonGroupComponent
  ]
})
export class NgRibbonModule {
}
