import {Component, Input} from '@angular/core';
import {DomUtilsService} from "../../../../services/dom-utils.service";
import {noop} from "rxjs";
import {NgRibbonWysiwygContext} from "../ng-ribbon-wysiwyg-context";
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";
import { NgRibbonContextComponent } from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component';
import { NgRibbonTabComponent } from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component';
import { NgRibbonGroupComponent } from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

enum ImagePosition {
  Inline,
  Left,
  Right
}

@Component({
    templateUrl: 'ng-ribbon-image-context.component.html',
    styles: [
        `:host {
      display: block;
    }`
    ],
    imports: [NgRibbonContextComponent, NgRibbonTabComponent, NgRibbonGroupComponent, MatButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})
export class NgRibbonImageContextComponent implements NgRibbonWysiwygContext {
  @Input() public ribbon: NgRibbonWysiwygComponent;
  @Input() public element: HTMLImageElement;

  // Importar tipos
  public readonly ImagePosition = ImagePosition;

  constructor(private _domUtils: DomUtilsService) {
  }

  public get position(): ImagePosition {
    if (this.element.style.float == 'left') {
      return ImagePosition.Left;
    } else if (this.element.style.float == 'right') {
      return ImagePosition.Right;
    } else {
      return ImagePosition.Inline;
    }
  }

  public set position(value: ImagePosition) {
    if (value == ImagePosition.Left) {
      this.element.style.float = 'left';
    } else if (value == ImagePosition.Right) {
      this.element.style.float = 'right';
    } else {
      this.element.style.float = '';
    }
  }

  public replace() {
    this._domUtils.uploadAsDataURL("image/*")
      .then(
        (image) => this.element.src = image,
        noop
      );
  }

  public delete() {
    // this.editor.editor.removeElement(this.element);
  }
}

