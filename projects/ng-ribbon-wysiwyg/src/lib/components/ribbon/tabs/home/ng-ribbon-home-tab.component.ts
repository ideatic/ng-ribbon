import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy, OutputRefSubscription, TemplateRef} from '@angular/core';
import {NgRibbonWysiwygComponent} from "../../ng-ribbon-wysiwyg.component";
import {EditorCommands} from "../../../textarea/editor-commands";
import {NgRibbonGroupComponent} from '../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatTooltip} from '@angular/material/tooltip';
import {DecimalPipe, NgTemplateOutlet} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SplitButtonComponent} from '../../components/split-button.component';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ListButtonsComponent} from './list-buttons.component';
import {NgRibbonTabComponent} from "../../../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'ng-ribbon-home-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgRibbonGroupComponent, NgTemplateOutlet, MatInput, FormsModule, MatAutocompleteTrigger, MatTooltip, MatAutocomplete, MatOption, MatIcon, MatDivider, MatMenuTrigger, MatMenu, MatMenuItem, SplitButtonComponent, ColorSketchModule, ListButtonsComponent, DecimalPipe, NgRibbonTabComponent, MatRipple, MatMenuContent],
  templateUrl: './ng-ribbon-home-tab.component.html',
  styleUrl: './ng-ribbon-home-tab.component.less'
})
export class NgRibbonHomeTabComponent implements  OnDestroy{
  // Deps
  protected readonly ribbon = inject(NgRibbonWysiwygComponent);
  private readonly _cdRef = inject(ChangeDetectorRef);

  // Bindings
  public readonly groupTemplate = input<TemplateRef<{ index: number }>>();

  // Estado
  protected backColor = 'yellow';
  protected foreColor = 'red';
  private _updateUiSubscription: OutputRefSubscription;

  // Importar tipos
  protected readonly Commands = EditorCommands;

  constructor() {
    // Actualizar estado de los botones cuando cambia el documento
    effect(() => {
      if (this.ribbon.editor()) {
        this._updateUiSubscription?.unsubscribe();
        this._updateUiSubscription = this.ribbon.editor().updateUI.subscribe(() => this._cdRef.detectChanges());
      }
    });
  }

  public execute(command: EditorCommands, value?: any) {
    this.ribbon.editor().execute(command, value);
  }

  public isActive(command: EditorCommands): boolean {
    return this.ribbon.editor().queryBooleanValue(command);
  }

  public queryValue(command: EditorCommands): string {
    return this.ribbon.editor().queryValue(command);
  }

  public isDisabled(command: EditorCommands): boolean {
    return !this.ribbon.editor().isCommandSupported(command);
  }

  public ngOnDestroy() {
    this._updateUiSubscription?.unsubscribe();
  }
}
