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
 * TinyMCE 6 language file (tinymce-i18n package, langs6 folder) for the locales whose code does not match the
 * file name. TinyMCE 6 has no pt_PT: pt_BR is used
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

  // State
  private _tinyMCE: Editor;
  private _html: string;
  private _propagateChange: (_: any) => void = noop;
  private _onTouched: () => void = noop;

  private _disabled: boolean;
  /**
   * Changes when the editor state changes (selection, undo, mode...). The queries read it so that the
   * templates that use them update by themselves: without zone.js, TinyMCE events do not trigger change detection
   */
  private readonly _uiState = signal(0);

  public ngOnInit() {
    // Configure TinyMCE
    const self = this;

    const extraSettings = this.tinyMceSettings() || {};

    // Setup method
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

    // Settings
    const settings: (RawEditorOptions & {
      quickbars_insert_toolbar: boolean,
      quickbars_selection_toolbar: string
    }) = {
      target: this._host.nativeElement.appendChild(document.createElement('textarea')),
      base_url: '/assets/ribbon/vendor/tinymce',
      // The URLs of the theme, skins and languages do not change between versions: without this suffix, the browser uses the files
      // of the previous version that it has cached, and the editor does not start
      cache_suffix: `v=${tinymce.majorVersion}.${tinymce.minorVersion}`,
      language: TINYMCE_LANGUAGES[this._locale] ?? this._locale.replace('-', '_'),
      directionality: getLocaleDirection(this._locale),
      content_style: this.editorCSS(),
      browser_spellcheck: true,
      height: '100%',
      width: '100%',
      contextmenu: false, // Use the browser menu
      custom_ui_selector: 'ng-ribbon', // Keep the editor from losing the selection when this element is selected
      plugins: 'lists link image table quickbars searchreplace code',
      menubar: false,
      statusbar: false,
      branding: false,
      paste_data_images: true,
      toolbar: false,
      // Converts <object> and <embed> into <img>, <video>, <audio> or <iframe> (GHSA-5359-pvf2-pw78; the default since TinyMCE 7)
      convert_unsafe_embeds: true,
      // Contextual tooltips
      quickbars_insert_toolbar: false, // Do not show the contextual bar on new lines
      quickbars_selection_toolbar: 'bold italic underline | blocks | backcolor forecolor',
      ...extraSettings
    };

    tinymce.init(settings);
  }

  /**
   * Gets the instance of the WYSIWYG editor in use (tinyMCE)
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

  /** Commands **/

  public execute(command: EditorCommands, value?: string) {
    if (this._disabled) {
      return;
    }
    this._tinyMCE.execCommand(command, false, value);
  }

  public queryValue(command: EditorCommands): string {
    this._uiState();
    if (command == EditorCommands.formatBlock) {
      // TinyMCE 6 no longer asks the browser for the current block: it is looked up with the block formats of the editor
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
 * Protects the editor from XSS bugs of TinyMCE 6.8.x that are only fixed in TinyMCE 7.x, a GPL-licensed version.
 * The content can come from someone else (shared or searched documents), so it is cleaned before it is loaded
 */
function protectFromUnpatchedXss(editor: Editor) {
  editor.on('PreInit', () => {
    // GHSA-q742-qvgc-gc2f: a data-mce-href, data-mce-src or data-mce-style in the content replaces the real attribute when
    // serializing, without validating the URL. They are removed when the HTML is parsed, as TinyMCE 7.9.3 does
    editor.parser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style', (nodes, name) => {
      nodes.forEach(node => node.attr(name, null));
    });

    // GHSA-mh5m-5hw4-5c69: with nested <svg> elements, the sanitizer thinks it is still inside an SVG and leaves all the
    // attributes (for example onerror) on the HTML elements that come after. The <svg> elements are removed before TinyMCE
    // parses the content, because the bug is in the parsing itself. All the HTML that enters the editor (load,
    // insert, paste), with or without events, goes through this parser
    const parse = editor.parser.parse.bind(editor.parser);
    editor.parser.parse = (html, args) => parse(removeSvgElements(html), args);
  });
}

/**
 * Removes all <svg> elements from the HTML. A cheat sheet document does not need them
 */
function removeSvgElements(html: string): string {
  // Without the tag in the text there cannot be any <svg> element: this avoids parsing the HTML in the normal case
  if (!/<svg/i.test(html)) {
    return html;
  }

  // It is parsed the same way as TinyMCE does, inside a body
  return cleanHtml(html, true, document => {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => svg.remove());
    return svgElements.length > 0;
  });
}
