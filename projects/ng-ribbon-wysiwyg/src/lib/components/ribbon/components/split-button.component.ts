import {ChangeDetectionStrategy, Component, input, output, TemplateRef} from '@angular/core';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from '@angular/material/icon';
import {MenuTriggerDirective} from '../../../directives/menu-trigger.directive';
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-split-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRipple, MatMenuTrigger, MatIcon, MenuTriggerDirective],
  template: `
    <button class="sm" matRipple (click)="mainBtnClick.emit($event)" [class.active]="isActive()" [disabled]="disabled()">
      <ng-content></ng-content>
    </button>
    @if (isMatMenu) {
      <button
        matRipple class="split-button" [matMenuTriggerFor]="$any(dropDownMenu())" [class.active]="isActive()" [disabled]="disabled()">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    } @else {
      <button matRipple class="split-button" [menuTriggerFor]="$any(dropDownMenu())" [class.active]="isActive()" [disabled]="disabled()">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    }
  `,
  styles: `
    :host {
      white-space: nowrap;
      display: inline-block;
    }

    .split-button {
      padding: 0 5px 0 0;
      margin-left: -5px;
      min-width: auto;
      font-weight: normal;
    }

    mat-icon {
      width: 20px;
    }
  `
})
export class SplitButtonComponent {
  public readonly disabled = input(false);
  public readonly isActive = input(false);
  public readonly dropDownMenu = input<TemplateRef<any> | MatMenu>(undefined);
  public readonly mainBtnClick = output<MouseEvent>();

  public get isMatMenu() {
    return this.dropDownMenu() instanceof MatMenu;
  }
}
