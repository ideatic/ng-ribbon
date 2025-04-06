import {Component, Input} from '@angular/core';
import {NgRibbonWysiwygContext} from "../ng-ribbon-wysiwyg-context";
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";
import { NgRibbonContextComponent } from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component';
import { NgRibbonTabComponent } from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component';

@Component({
    templateUrl: 'ng-ribbon-table-context.component.html',
    styles: [
        `:host {
      display: block;
    }`
    ],
    imports: [NgRibbonContextComponent, NgRibbonTabComponent]
})
export class NgRibbonTableContextComponent implements NgRibbonWysiwygContext {

  @Input() public ribbon: NgRibbonWysiwygComponent;
  @Input() public element: HTMLTableElement;
}

