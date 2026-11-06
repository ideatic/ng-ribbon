import {Component, ElementRef, forwardRef, inject, input, LOCALE_ID, OnDestroy, OnInit, output, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs";
import {EditorCommands} from "./editor-commands";
import {cleanHtml} from "./clean-html";
import {getLocaleDirection} from "@angular/common";

// Import TinyMCE
import type {Editor, RawEditorOptions} from 'tinymce';
import tinymce from 'tinymce/tinymce';
//import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/icons/default';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/code';

declare const ngDevMode: boolean;

/**
 * Fichero de idioma de TinyMCE 6 (paquete tinymce-i18n, carpeta langs6) de los locales cuyo código no coincide con el
 * nombre del fichero. TinyMCE 6 no tiene pt_PT: se usa pt_BR
 */
const TINYMCE_LANGUAGES: Record<string, string> = {pt: 'pt_BR', fr: 'fr_FR', ko: 'ko_KR'};

@Component({
  selector: 'ng-ribbon-textarea',
  template: '',
  styles: `
    :host {
      display: block;
      outline: none;
      background: var(--bg-color, white);
      overflow: hidden;
      width: 100%;
      height: 100%;
      min-height: 100%;
    }

    :host ::ng-deep .tox-tinymce {
      border: none !important;
    }
  `,
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
  public readonly tinyMceSettings = input<RawEditorOptions>(undefined);
  public readonly updateUI = output();

  // Estado
  private _tinyMCE: Editor;
  private _html: string;
  private _propagateChange: (_: any) => void = noop;
  private _onTouched: () => void = noop;

  private _disabled: boolean;
  /**
   * Cambia cuando cambia el estado del editor (selección, deshacer, modo...). Las consultas lo leen para que las
   * plantillas que las usan se actualicen solas: sin zone.js, los eventos de TinyMCE no lanzan la detección de cambios
   */
  private readonly _uiState = signal(0);

  public ngOnInit() {
    // Configurar TinyMCE
    const self = this;

    const extraSettings = this.tinyMceSettings() || {};

    // Método setup
    const prevSetup = extraSettings.setup;
    extraSettings.setup = (editor) => {
      protectFromUnpatchedXss(editor);

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
          if (ngDevMode) {
            console.time('Get HTML content');
          }

          this._html = editor.getContent();

          if (ngDevMode) {
            console.timeEnd('Get HTML content');
            console.time('Propagate HTML content');
          }

          this._propagateChange(this._html);

          if (ngDevMode) {
            console.timeEnd('Propagate HTML content');
          }
        });

        const bumpUIState = () => this._uiState.update(version => version + 1);
        editor.on('NodeChange', () => {
          bumpUIState();
          this.updateUI.emit();
        });
        editor.on('change undo redo', bumpUIState);
      });

      if (prevSetup) {
        prevSetup(editor);
      }
    };

    // Configuraciones
    const settings: (RawEditorOptions & {
      quickbars_insert_toolbar: boolean,
      quickbars_selection_toolbar: string
    }) = {
      target: this._host.nativeElement.appendChild(document.createElement('textarea')),
      base_url: '/assets/ribbon/vendor/tinymce',
      language: TINYMCE_LANGUAGES[this._locale] ?? this._locale.replace('-', '_'),
      directionality: getLocaleDirection(this._locale),
      content_style: this.editorCSS(),
      browser_spellcheck: true,
      height: '100%',
      width: '100%',
      contextmenu: false, // Usar menú del navegador
      custom_ui_selector: 'ng-ribbon', // Evitar que pierda la selección al seleccionar este elemento
      plugins: 'lists link image table quickbars searchreplace code',
      menubar: false,
      statusbar: false,
      branding: false,
      paste_data_images: true,
      toolbar: false,
      // Convierte <object> y <embed> en <img>, <video>, <audio> o <iframe> (GHSA-5359-pvf2-pw78; por defecto desde TinyMCE 7)
      convert_unsafe_embeds: true,
      // Tooltips contextuales
      quickbars_insert_toolbar: false, // No mostrar barra contextual en nuevas líneas
      quickbars_selection_toolbar: 'bold italic underline | blocks | backcolor forecolor',
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
    this._uiState();
    if (command == EditorCommands.formatBlock) {
      // TinyMCE 6 ya no pregunta al navegador por el bloque actual: se busca con los formatos de bloque del editor
      return this._tinyMCE?.formatter.closest(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'div', 'address', 'blockquote']) ?? '';
    }
    return this._tinyMCE?.queryCommandValue(command) as string;
  }

  public queryBooleanValue(command: EditorCommands): boolean {
    this._uiState();
    return this._tinyMCE?.queryCommandState(command);
  }

  public isCommandSupported(command: EditorCommands): boolean {
    this._uiState();
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
    this._uiState();
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
    this._uiState.update(version => version + 1);

    if (this._tinyMCE) {
      this._tinyMCE.mode.set(isDisabled ? 'readonly' : 'design');
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

/**
 * Protege el editor de fallos XSS de TinyMCE 6.8.x que solo se corrigen en TinyMCE 7.x, una versión con licencia GPL.
 * El contenido puede venir de otra persona (documentos compartidos o buscados), así que se limpia antes de cargarlo
 */
function protectFromUnpatchedXss(editor: Editor) {
  editor.on('PreInit', () => {
    // GHSA-q742-qvgc-gc2f: un data-mce-href, data-mce-src o data-mce-style del contenido sustituye al atributo real al
    // serializar, sin validar la URL. Se quitan al analizar el HTML, igual que hace TinyMCE 7.9.3
    editor.parser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style', (nodes, name) => {
      nodes.forEach(node => node.attr(name, null));
    });

    // GHSA-mh5m-5hw4-5c69: con elementos <svg> anidados, el sanitizador cree que sigue dentro de un SVG y deja todos los
    // atributos (por ejemplo onerror) en los elementos HTML que vienen detrás. Se quitan los <svg> antes de que TinyMCE
    // analice el contenido, porque el fallo está en el propio análisis. Todo el HTML que entra en el editor (cargar,
    // insertar, pegar), con eventos o sin ellos, pasa por este analizador
    const parse = editor.parser.parse.bind(editor.parser);
    editor.parser.parse = (html, args) => parse(removeSvgElements(html), args);
  });
}

/**
 * Quita todos los elementos <svg> del HTML. Un documento de chuletas no los necesita
 */
function removeSvgElements(html: string): string {
  // Sin la etiqueta en el texto no puede haber ningún elemento <svg>: se evita analizar el HTML en el caso normal
  if (!/<svg/i.test(html)) {
    return html;
  }

  // Se analiza igual que TinyMCE, dentro de un body
  return cleanHtml(html, true, document => {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => svg.remove());
    return svgElements.length > 0;
  });
}
