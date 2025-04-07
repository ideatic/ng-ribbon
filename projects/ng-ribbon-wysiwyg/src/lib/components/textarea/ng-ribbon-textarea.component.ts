import {Component, ElementRef, forwardRef, LOCALE_ID, NgZone, OnDestroy, OnInit, inject, output, input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs";
import {EditorCommands} from "./editor-commands";
import {getLocaleDirection} from "@angular/common";
// Import TinyMCE
import {Editor, RawEditorSettings} from 'tinymce';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/table';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/code';

@Component({
  selector: 'ng-ribbon-textarea',
  template: '',
  styles: [`
    :host {
      display: block;
      outline: none;
      background: white;
      overflow: hidden;
      width: 100%;
      height: 100%;
      min-height: 100%;
    }

    :host ::ng-deep .tox-tinymce {
      border: none !important;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgRibbonTextAreaComponent),
      multi: true
    }
  ]
})
export class NgRibbonTextAreaComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // Deps
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _locale = inject(LOCALE_ID);

  // Bindings
  public readonly editorCSS = input<string>(undefined);
  public readonly tinyMceSettings = input<RawEditorSettings>(undefined);
  public readonly updateUI = output();

  // Estado
  private _tinyMCE: Editor;
  private _html: string;
  private _propagateChange: (_: any) => void = noop;
  private _onTouched: () => void = noop;

  private _disabled: boolean;

  public ngOnInit() {
    // Configurar TinyMCE
    const self = this;

    const extraSettings = this.tinyMceSettings() || {};

    // Método setup
    const prevSetup = extraSettings.setup;
    extraSettings.setup = (editor) => {
      editor.on('init', () => {
        if (this._tinyMCE) {
          return;
        }

        this._tinyMCE = editor;

        this.setDisabledState(this._disabled);
        this.focus();

        if (self._html) {
          editor.setContent(self._html);
        }

        editor.on('blur', () => this._onTouched());

        editor.on('change keyup undo redo', () => {
          this._html = editor.getContent();
          this._propagateChange(this._html);
        });

        editor.on('NodeChange', () => this.updateUI.emit());
      });

      if (prevSetup) {
        prevSetup(editor);
      }
    };

    // Configuraciones
    const settings: (RawEditorSettings & {
      contextmenu: boolean,
      quickbars_insert_toolbar: boolean,
      quickbars_selection_toolbar: string
    }) = {
      target: this._host.nativeElement.appendChild(document.createElement('textarea')),
      base_url: '/assets/ribbon/vendor/tinymce',
      language: (this._locale == 'pt' ? 'pt_PT' : this._locale).replace('-', '_'),
      directionality: getLocaleDirection(this._locale),
      content_style: this.editorCSS(),
      browser_spellcheck: true,
      height: '100%',
      width: '100%',
      contextmenu: false as any, // Usar menú del navegador
      custom_ui_selector: 'ng-ribbon', // Evitar que pierda la selección al seleccionar este elemento
      plugins: 'lists link image table paste imagetools quickbars searchreplace code',
      menubar: false,
      statusbar: false,
      branding: false,
      paste_data_images: true,
      toolbar: false,
      imagetools_cors_hosts: [window.location.hostname],
      // Tooltips contextuales
      quickbars_insert_toolbar: false, // No mostrar barra contextual en nuevas líneas
      quickbars_selection_toolbar: 'bold italic underline | formatselect | backcolor forecolor',
      ...extraSettings
    };

    tinymce.init(settings);
  }

  /**
   * Obtiene la instancia del editor WYSIWYG utilizado (tinyMCE)
   */
  public get tinyMCE(): Editor {
    return this._tinyMCE;
  }

  public get html() {
    return this._html;
  }

  public set html(value: string) {
    this.writeValue(value);
    this._propagateChange(value);
  }

  public get isDisabled(): boolean {
    return this._disabled;
  }

  public focus() {
    this._tinyMCE?.focus(false);
  }

  /** Comandos **/

  public execute(command: EditorCommands, value?: string) {
    if (this._disabled) {
      return;
    }
    this._tinyMCE.execCommand(command, false, value);
  }

  public queryValue(command: EditorCommands): string {
    return this._tinyMCE?.queryCommandValue(command) as string;
  }

  public queryBooleanValue(command: EditorCommands): boolean {
    return this._tinyMCE?.queryCommandState(command);
  }

  public isCommandSupported(command: EditorCommands): boolean {
    if (this._disabled) {
      return false;
    } else if (this._tinyMCE) {
      if (command == EditorCommands.undo) {
        return this._tinyMCE.undoManager.hasUndo();
      } else if (command == EditorCommands.redo) {
        return this._tinyMCE.undoManager.hasRedo();
      } else {
        return this._tinyMCE.queryCommandSupported(command);
      }
    } else {
      return false;
    }
  }

  /* Active element */

  public get activeElement(): Element {
    return this._tinyMCE?.selection.getNode();
  }
  /* Font */

  public get fontFamily(): string {
    const fontFamily = this.queryValue(EditorCommands.fontName);

    if (fontFamily) {
      return fontFamily.split(/\s*,\s*/)[0].replace(/^['"]+|['"]+$/g, '');
    } else {
      return null;
    }
  }
  public set fontFamily(name: string) {
    this.execute(EditorCommands.fontName, name);
  }

  public get fontSize(): number {
    const fontSize = this.queryValue(EditorCommands.fontSize);
    return fontSize || fontSize === '0' ? parseInt(fontSize, 10) : null;
  }

  public set fontSize(value: number) {
    this.execute(EditorCommands.fontSize, value + 'px');
  }

  /* ControlValueAccessor */

  public registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;

    if (this._tinyMCE) {
      this._tinyMCE.setMode(isDisabled ? 'readonly' : 'design');
    }
  }

  public writeValue(value: string) {
    this._html = value;
    if (this._tinyMCE) {
      this._tinyMCE.setContent(value);
    }
  }

  public ngOnDestroy() {
    tinymce.remove(this._tinyMCE);
  }
}
