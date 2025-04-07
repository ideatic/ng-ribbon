import {ChangeDetectorRef, Component, inject, input, OnChanges, OutputRefSubscription, SimpleChanges, TemplateRef, viewChild, contentChild} from '@angular/core';
import {NgRibbonTextAreaComponent} from "../textarea/ng-ribbon-textarea.component";
import {EditorCommands} from "../textarea/editor-commands";
import {NgRibbonComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon/ng-ribbon.component";
import {NgRibbonWysiwygSettings} from "./ng-ribbon-wysiwyg-settings";
import {NgRibbonContextComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component";
import {IconsService} from "../../services/icons.service";
import {NgTemplateOutlet} from '@angular/common';
import {NgRibbonTabComponent} from '../../../../../ng-ribbon/src/lib/components/ng-ribbon-tab/ng-ribbon-tab.component';
import {NgRibbonHomeTabComponent} from './tabs/home/ng-ribbon-home-tab.component';
import {NgRibbonInsertTabComponent} from "./tabs/ng-ribbon-insert-tab.component";

@Component({
  selector: 'ng-ribbon-wysiwyg',
  imports: [NgRibbonComponent, NgRibbonContextComponent, NgTemplateOutlet, NgRibbonTabComponent, NgRibbonHomeTabComponent, NgRibbonInsertTabComponent],
  templateUrl: './ng-ribbon-wysiwyg.component.html',
  styleUrls: ['ng-ribbon-wysiwyg.component.less']
})
export class NgRibbonWysiwygComponent implements OnChanges {
  // Deps
  private readonly _cdRef = inject(ChangeDetectorRef);

  // Bindings
  public readonly editor = input<NgRibbonTextAreaComponent>();
  public readonly settings = input(new NgRibbonWysiwygSettings());

  public readonly ribbon = viewChild(NgRibbonComponent);
  public readonly mainContext = viewChild.required<NgRibbonContextComponent>('mainContext');

  public readonly mainContextHeader = contentChild<TemplateRef<void>>('mainContextHeader');

  // Estado
  private _subscription: OutputRefSubscription;


  constructor() {
    inject(IconsService).configure();
  }

  public ngOnChanges(change: SimpleChanges) {
    if (change['editor']) {
        this._subscription?.unsubscribe();

      // Actualizar estado de los botones cuando cambia el documento
      const editor = this.editor();
      if (editor) {
        this._subscription = editor.updateUI.subscribe(() => this.updateUI());
        this.updateUI();
      }
    }
  }

  protected updateUI() {
    // Comprobar contextos activos
    // this._defineActiveContexts();

    // Detectar cambio
    this._cdRef.markForCheck();
  }

  public execute(command: EditorCommands, value?: string) {
    this.editor().execute(command, value);
  }

  public isDisabled(command: EditorCommands): boolean {
    const editor = this.editor();
    return !editor || !editor.isCommandSupported(command);
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
