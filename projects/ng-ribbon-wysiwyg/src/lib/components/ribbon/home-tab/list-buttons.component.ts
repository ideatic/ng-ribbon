import {Component} from '@angular/core';
import {EditorCommands} from "../../textarea/editor-commands";
import {NgRibbonHomeTabComponent} from "./ng-ribbon-home-tab.component";
import {DomSanitizer} from "@angular/platform-browser";
import {EditorIconsService} from "../../textarea/editor-icons.service";

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
      <img src="{{ homeTab.ribbon.settings.assetsURL }}/images/list.png"/>
      <ng-template #listMenu>
        <div class="list-type-menu">
          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'disc'})">
            <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-bull-default']"></ng-ribbon-wysiwyg-editor-icon>
          </button>

          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'circle'})">
            <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-bull-circle']"></ng-ribbon-wysiwyg-editor-icon>
          </button>

          <button mat-button (click)="homeTab.execute(Commands.insertUnorderedList, {'list-style-type': 'square'})">
            <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-bull-square']"></ng-ribbon-wysiwyg-editor-icon>
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
      <img src="{{ homeTab.ribbon.settings.assetsURL }}/images/list-ordered.png"/>
      <ng-template #orderedListMenu>
        <div class="list-type-menu">
          <div>
            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'decimal'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-default']"></ng-ribbon-wysiwyg-editor-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-alpha'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-lower-alpha']"></ng-ribbon-wysiwyg-editor-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-greek'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-lower-greek']"></ng-ribbon-wysiwyg-editor-icon>
            </button>
          </div>

          <div>
            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'lower-roman'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-lower-roman']"></ng-ribbon-wysiwyg-editor-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'upper-alpha'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-upper-alpha']"></ng-ribbon-wysiwyg-editor-icon>
            </button>

            <button mat-button (click)="homeTab.execute(Commands.insertOrderedList, {'list-style-type': 'upper-roman'})">
              <ng-ribbon-wysiwyg-editor-icon [icon]="iconSvc.icons['list-num-upper-roman']"></ng-ribbon-wysiwyg-editor-icon>
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

    ng-ribbon-wysiwyg-editor-icon {
      display: block;
      width: 48px;
      height: 48px;
    }
  `]
})
export class ListButtonsComponent {
  // Importar tipos
  public readonly Commands = EditorCommands;

  constructor(public homeTab: NgRibbonHomeTabComponent,
              public iconSvc: EditorIconsService,
              public sanitizer: DomSanitizer) {

  }
}
