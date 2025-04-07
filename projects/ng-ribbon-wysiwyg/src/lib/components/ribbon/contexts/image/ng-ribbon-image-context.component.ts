import {Component, inject, Input} from '@angular/core';
import {DomUtilsService} from "../../../../services/dom-utils.service";
import {noop} from "rxjs";
import {NgRibbonWysiwygContext} from "../ng-ribbon-wysiwyg-context";
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";
import {NgRibbonContextComponent} from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component';
import {NgRibbonTabComponent} from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component';
import {NgRibbonGroupComponent} from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatRipple} from "@angular/material/core";

enum ImagePosition {
  Inline,
  Left,
  Right
}

@Component({
  imports: [NgRibbonContextComponent, NgRibbonTabComponent, NgRibbonGroupComponent, MatRipple, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem],
  templateUrl: 'ng-ribbon-image-context.component.html',
  styles: `
    :host {
      display: block;
    }
  `
})
export class NgRibbonImageContextComponent implements NgRibbonWysiwygContext {
  // Deps
  private readonly _domUtils = inject(DomUtilsService);

  // Bindings
  @Input() public ribbon: NgRibbonWysiwygComponent;
  @Input() public element: HTMLImageElement;

  // Importar tipos
  public readonly ImagePosition = ImagePosition;

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

