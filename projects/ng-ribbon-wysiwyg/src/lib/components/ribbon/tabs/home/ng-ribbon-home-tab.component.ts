import {Component, inject} from '@angular/core';
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";
import {EditorCommands} from "../../../textarea/editor-commands";
import {NgRibbonGroupComponent} from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component';
import {MatList} from '@angular/material/list';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatTooltip} from '@angular/material/tooltip';
import {DecimalPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SplitButtonComponent} from '../../components/split-button.component';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ListButtonsComponent} from './list-buttons.component';

@Component({
  selector: 'ng-ribbon-home-tab',
  templateUrl: './ng-ribbon-home-tab.component.html',
  styleUrls: ['./ng-ribbon-home-tab.component.less'],
  imports: [NgRibbonGroupComponent, MatList, MatInput, FormsModule, MatAutocompleteTrigger, MatTooltip, MatAutocomplete, MatOption, MatButton, MatIcon, MatDivider, MatMenuTrigger, MatMenu, MatMenuItem, SplitButtonComponent, ColorSketchModule, ListButtonsComponent, DecimalPipe]
})
export class NgRibbonHomeTabComponent {
  // Deps
  protected readonly ribbon = inject(NgRibbonWysiwygComponent);

  // Estado
  protected backColor = 'yellow';
  protected foreColor = 'red';

  // Importar tipos
  protected readonly Commands = EditorCommands;

  public execute(command: EditorCommands, value?: any) {
    this.ribbon.editor().execute(command, value);
  }

  public isActive(command: EditorCommands): boolean {
    return this.ribbon.editor().queryBooleanValue(command);
  }

  public isDisabled(command: EditorCommands): boolean {
    return !this.ribbon.editor().isCommandSupported(command);
  }
}
