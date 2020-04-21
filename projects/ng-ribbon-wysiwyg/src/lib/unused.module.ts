import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgRibbonModule} from "../../../ng-ribbon/src/lib/ng-ribbon.module";
import {MaterialModule} from "./material.module";
import {FormsModule} from "@angular/forms";
import {NgRibbonImageContextComponent} from "./components/ribbon/contexts/image/ng-ribbon-image-context.component";
import {NgRibbonTableContextComponent} from "./components/ribbon/contexts/table/ng-ribbon-table-context.component";

/**
 * Not implemented yet components
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgRibbonModule,
    MaterialModule
  ],
  declarations: [
    NgRibbonImageContextComponent,
    NgRibbonTableContextComponent
  ]
})
export class UnusedModule {
}
