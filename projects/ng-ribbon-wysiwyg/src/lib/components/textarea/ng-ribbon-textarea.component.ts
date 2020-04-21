import {Component, ElementRef, EventEmitter, forwardRef, Inject, Input, LOCALE_ID, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs";
import {EditorCommands} from "./editor-commands";
import {HtmlToolsService} from "../../services/html-tools.service";
import {getLocaleDirection} from "@angular/common";
// Import TinyMCE
import {Editor, Settings} from 'tinymce';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
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
    }

    ::ng-deep .tox-tinymce {
      border: none !important;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgRibbonTextareaComponent),
      multi: true
    }
  ]
})
export class NgRibbonTextareaComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() editorCSS: string;
  @Input() tinyMceSettings: Settings;
  @Output() updateUI = new EventEmitter();

  // Estado
  private _tinyMCE: Editor;
  private _html: string;
  private _propagateChange: (_: any) => void = noop;
  private _onTouched: () => void = noop;

  private _disabled: boolean;

  constructor(private _host: ElementRef<HTMLElement>,
              @Inject(LOCALE_ID) private _locale: string,
              private _htmlToolsSvc: HtmlToolsService,
              private _ngZone: NgZone) {

  }

  public ngOnInit() {
    // Configurar TinyMCE
    const self = this;

    const extraSettings = this.tinyMceSettings || {};

    // Método setup
    const prevSetup = extraSettings.setup;
    extraSettings.setup = (editor) => {
      editor.on('init', () => {
        if (this._tinyMCE) {
          return;
        }

        this._tinyMCE = editor;

        if (self._html) {
          editor.setContent(self._html);
        }
        this.setDisabledState(this._disabled);

        this.focus();

        editor.on('blur', () => this._ngZone.run(() => this._onTouched()));

        editor.on('change keyup undo redo', () => {
          this._ngZone.run(() => {
            this._html = editor.getContent();
            this._propagateChange(this._html);
          });
        });

        editor.on('NodeChange', () => {
          this._ngZone.run(() => {
            this.updateUI.emit();
          });
        });
      });

      if (prevSetup) {
        prevSetup(editor);
      }
    };

    // Configuraciones
    const settings: (Settings & {
      contextmenu: boolean,
      quickbars_insert_toolbar: boolean,
      quickbars_selection_toolbar: string,
      powerpaste_word_import: string,
      powerpaste_html_import: string,
    }) = {
      target: this._host.nativeElement,
      base_url: '/assets/ribbon/vendor/tinymce',
      directionality: getLocaleDirection(this._locale),
      language: this._locale,
      //inline:true,
      content_style: this.editorCSS,
      browser_spellcheck: true,
      min_height: '100%',
      height: '100%',
      min_width: '100%',
      width: '100%',
      contextmenu: false, // Usar menú del navegador
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
      // Powerpaste
      powerpaste_word_import: 'merge',
      powerpaste_html_import: 'merge',
      ...extraSettings
    };

    this._ngZone.runOutsideAngular(() => tinymce.init(settings));
  }

  public ngOnDestroy() {
    this._ngZone.runOutsideAngular(() => tinymce.remove(this._tinyMCE));
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
    return parseInt(this.queryValue(EditorCommands.fontSize), 10);
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
}
