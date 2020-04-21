import {Component, Input} from '@angular/core';
import {NgRibbonWysiwygContext} from "../ng-ribbon-wysiwyg-context";
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";

@Component({
  templateUrl: 'ng-ribbon-table-context.component.html',
  styles: [
      `:host {
      display: block;
    }`
  ]
})
export class NgRibbonTableContextComponent implements NgRibbonWysiwygContext {

  @Input() public ribbon: NgRibbonWysiwygComponent;
  @Input() public element: HTMLTableElement;
}

