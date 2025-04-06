import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {MatMenu} from "@angular/material/menu";

@Component({
    selector: 'app-split-button',
    template: `
    <button class="sm" mat-button (click)="mainBtnClick.emit($event)" [class.active]="isActive" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
    @if (isMatMenu) {
      <button
        mat-button class="split-button" [matMenuTriggerFor]="$any(dropDownMenu)" [class.active]="isActive" [disabled]="disabled">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    } @else {
      <button mat-button class="split-button" [menuTriggerFor]="$any(dropDownMenu)" [class.active]="isActive" [disabled]="disabled">
        <mat-icon class="drop-down-icon">arrow_drop_down</mat-icon>
      </button>
    }
    `,
    styles: [`
      .split-button {
        padding: 0 5px 0 0;
        margin-left: -5px;
        min-width: auto;
        font-weight: normal;
      }

      mat-icon {
        width: 20px !important;
      }
    `],
    standalone: false
})
export class SplitButtonComponent {
  @Input() public disabled = false;
  @Input() public isActive = false;
  @Input() public dropDownMenu: TemplateRef<any> | MatMenu;
  @Output() public mainBtnClick = new EventEmitter<MouseEvent>();

  public get isMatMenu() {
    return this.dropDownMenu instanceof MatMenu;
  }
}
