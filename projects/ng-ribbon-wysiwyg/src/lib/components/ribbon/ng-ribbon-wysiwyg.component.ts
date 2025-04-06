import {ChangeDetectorRef, Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NgRibbonTextAreaComponent} from "../textarea/ng-ribbon-textarea.component";
import {EditorCommands} from "../textarea/editor-commands";
import {noop, Subscription} from "rxjs";
import {NgRibbonComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon/ng-ribbon.component";
import {NgRibbonWysiwygSettings} from "./ng-ribbon-wysiwyg-settings";
import {NgRibbonContextComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component";
import {DomUtilsService} from "../../services/dom-utils.service";
import {IconsService} from "../../services/icons.service";
import { NgTemplateOutlet } from '@angular/common';
import { NgRibbonTabComponent } from '../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component';
import { NgRibbonHomeTabComponent } from './home-tab/ng-ribbon-home-tab.component';
import { NgRibbonGroupComponent } from '../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { SymbolListComponent } from './components/symbol-list.component';

@Component({
    selector: 'ng-ribbon-wysiwyg',
    templateUrl: './ng-ribbon-wysiwyg.component.html',
    styleUrls: ['ng-ribbon-wysiwyg.component.less'],
    imports: [NgRibbonComponent, NgRibbonContextComponent, NgTemplateOutlet, NgRibbonTabComponent, NgRibbonHomeTabComponent, NgRibbonGroupComponent, MatButton, MatTooltip, MatIcon, SymbolListComponent]
})
export class NgRibbonWysiwygComponent implements OnChanges {
  @Input() public editor: NgRibbonTextAreaComponent;
  @Input() public settings = new NgRibbonWysiwygSettings();

  @ViewChild(NgRibbonComponent, {static: true}) public ribbon: NgRibbonComponent;
  @ViewChild('mainContext', {static: true}) public mainContext: NgRibbonContextComponent;

  @ContentChild('mainContextHeader') public mainContextHeader: TemplateRef<void>;

  // Estado
  private _subscription: Subscription;

  // Valores
  public readonly defaultTable = `<table>
<thead>
<tr><th></th><th></th></tr>
</thead>
<tbody>
<tr><td></td><td></td></tr>
<tr><td></td><td></td></tr>
</tbody>
</table>`;
  public readonly defaultQuote = `<blockquote>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a ante ut purus aliquam pellentesque. Suspendisse potenti. In sit amet risus quam, et egestas mauris. Nunc feugiat risus ut est facilisis condimentum. Sed et turpis velit, sit amet pharetra lacus.</blockquote>`;


  // Importar tipos en la plantilla
  public readonly Commands = EditorCommands;

  constructor(private _cd: ChangeDetectorRef,
              private _domUtils: DomUtilsService,
              iconsSvc: IconsService) {
    iconsSvc.configure();
  }

  public ngOnChanges(change: SimpleChanges) {
    if (change['editor']) {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }

      // Actualizar estado de los botones cuando cambia el documento
      if (this.editor) {
        this._subscription = this.editor.updateUI.subscribe(() => this.updateUI());
        this.updateUI();
      }
    }
  }

  public updateUI() {
    // Comprobar contextos activos
    // this._defineActiveContexts();

    // Detectar cambio
    this._cd.markForCheck();
  }

  public execute(command: EditorCommands, value?: string) {
    this.editor.execute(command, value);
  }


  public isDisabled(command: EditorCommands): boolean {
    return !this.editor || !this.editor.isCommandSupported(command);
  }

  public insertImage() {
    this._domUtils.uploadAsDataURL("image/*")
      .then(
        (image) => this.execute(EditorCommands.insertHTML, `<img src="${image}" />`),
        noop
      );
  }

  public insertChart() {
    throw new Error('Not implemented');
  }

  /*

interface PortalConfig<T extends NgRibbonWysiwygContext> {
  type: T,
  portal: ComponentPortal<T>;
  configure: (ref: CdkPortalOutletAttachedRef) => void,
  ref?: ComponentRef<T>
}


   public activeContexts: PortalConfig<any>[] = [];
   private _defineActiveContexts() {
     // Elegir contextos activos
    const contexts = [];
     let node = this.editor.activeElement;
     while (node) {
       const currentNode = node;
       const tagName = ((node as HTMLElement).tagName || '').toLowerCase();

       if (node instanceof HTMLImageElement || tagName == 'img') {
         contexts.push({
           type: NgRibbonImageContextComponent,
           node: currentNode
         })
       } else if (node instanceof HTMLTableElement || tagName == 'table') {
         contexts.push({
           type: NgRibbonTableContextComponent,
           node: currentNode
         })
       }

       node = node.parentElement;
     }

     // Configurar contextos (crearlos si no existen, o actualizarlos si ya existen)
     const activeContexts = [];
     for (const context of contexts) {
       let portal: PortalConfig<NgRibbonWysiwygContext> = this.activeContexts.find(c => c.type == context.type);
       if (portal && portal.ref) {
         portal.ref.instance.editor = this;
         portal.ref.instance.element = context.node;
       } else {
         portal = {
           type: context.type,
           portal: new ComponentPortal<any>(context.type),
           configure: (ref: CdkPortalOutletAttachedRef) => {
             portal.ref = ref as ComponentRef<any>;
             portal.ref.instance.editor = this;
             portal.ref.instance.element = context.node;
           }
         }
       }

       activeContexts.push(portal);
     }
     this.activeContexts = activeContexts;
  }*/
}
