import {Component, inject} from '@angular/core';
import {EditorCommands} from "../../textarea/editor-commands";
import {NgRibbonHomeTabComponent} from "./ng-ribbon-home-tab.component";
import {SplitButtonComponent} from '../components/split-button.component';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-list-buttons',
  template: `
    <!-- Listas desordenadas -->
    <app-split-button
      matTooltip="Lista" i18n-matTooltip class="sm"
      (mainBtnClick)="homeTab.execute(Commands.insertUnorderedList)"
      [dropDownMenu]="listMenu"
      [isActive]="homeTab.isActive(Commands.insertUnorderedList)"
      [disabled]="homeTab.isDisabled(Commands.insertUnorderedList)"
    >
      <mat-icon svgIcon="unordered-list" />
      <ng-template #listMenu>
        <div class="list-type-menu">
          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'disc'})">
            <mat-icon svgIcon="list-bull-default"></mat-icon>
          </button>

          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'circle'})">
            <mat-icon svgIcon="list-bull-circle"></mat-icon>
          </button>

          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'square'})">
            <mat-icon svgIcon="list-bull-square"></mat-icon>
          </button>
        </div>
      </ng-template>
    </app-split-button>


    <!-- Listas ordenadas -->
    <app-split-button
      matTooltip="Lista ordenada" i18n-matTooltip class="sm"
      (mainBtnClick)="homeTab.execute(Commands.insertOrderedList)"
      [dropDownMenu]="orderedListMenu"
      [isActive]="homeTab.isActive(Commands.insertOrderedList)"
      [disabled]="homeTab.isDisabled(Commands.insertOrderedList)"
    >
      <mat-icon svgIcon="ordered-list" />
      <ng-template #orderedListMenu>
        <div class="list-type-menu">
          <div>
            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'decimal'})">
              <mat-icon svgIcon="list-num-default"></mat-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-alpha'})">
              <mat-icon svgIcon="list-num-lower-alpha"></mat-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-greek'})">
              <mat-icon svgIcon="list-num-lower-greek"></mat-icon>
            </button>
          </div>

          <div>
            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-roman'})">
              <mat-icon svgIcon="list-num-lower-roman"></mat-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'upper-alpha'})">
              <mat-icon svgIcon="list-num-upper-alpha"></mat-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'upper-roman'})">
              <mat-icon svgIcon="list-num-upper-roman"></mat-icon>
            </button>
          </div>
        </div>
      </ng-template>
    </app-split-button>
  `,
  styles: [`
    .list-type-menu {
      background: white;
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 3px;
      box-shadow: 0 4px 8px 0 rgba(34, 47, 62, .1);
    }

    .list-type-menu mat-icon {
      display: block;
      width: 48px;
      height: 48px;
    }
  `],
  imports: [SplitButtonComponent, MatTooltip, MatIcon, MatButton]
})
export class ListButtonsComponent {
  homeTab = inject(NgRibbonHomeTabComponent);

  // Importar tipos
  public readonly Commands = EditorCommands;
}
