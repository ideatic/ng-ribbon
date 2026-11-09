import {
  Component,
  computed,
  contentChild,
  inject,
  input,
  OnChanges,
  TemplateRef,
  Type,
  viewChild
} from '@angular/core';
import {NgRibbonTextAreaComponent} from "../textarea/ng-ribbon-textarea.component";
import {NgRibbonWysiwygContext} from "./contexts/ng-ribbon-wysiwyg-context";
import {EditorCommands} from "../textarea/editor-commands";
import {NgRibbonComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon/ng-ribbon.component";
import {NgRibbonWysiwygSettings} from "./ng-ribbon-wysiwyg-settings";
import {NgRibbonContextComponent} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon-context/ng-ribbon-context.component";
import {IconsService} from "../../services/icons.service";
import {NgComponentOutlet, NgTemplateOutlet} from '@angular/common';
import {NgRibbonImageContextComponent} from './contexts/image/ng-ribbon-image-context.component';
import {NgRibbonTableContextComponent} from './contexts/table/ng-ribbon-table-context.component';
import {NgRibbonHomeTabComponent} from './tabs/home/ng-ribbon-home-tab.component';
import {NgRibbonInsertTabComponent} from "./tabs/ng-ribbon-insert-tab.component";

@Component({
  selector: 'ng-ribbon-wysiwyg',
  imports: [NgRibbonComponent, NgRibbonContextComponent, NgTemplateOutlet, NgComponentOutlet, NgRibbonHomeTabComponent, NgRibbonInsertTabComponent],
  template: `
    <ng-ribbon [settings]="settings()">
      <ng-ribbon-context #mainContext>
        <!-- Ribbon header -->
        <ng-template #header>
          @if (settings().useContexts) {
            <ng-container [ngTemplateOutlet]="mainContextHeader()"/>
          }
        </ng-template>

        <!-- Home (its buttons stay disabled until there is an editor, so the ribbon does not change when the editor loads) -->
        @if (settings().showHomeTab) {
          <ng-ribbon-home-tab [groupTemplate]="homeGroupTemplate()"/>
        }

        <!-- Insert -->
        @if (settings().showInsertTab) {
          <ng-ribbon-insert-tab/>
        }

        <!-- Other tabs -->
        <ng-content/>
      </ng-ribbon-context>

      <!-- Contextual tabs (image, table...) of the element selected in the editor -->
      @for (context of activeContexts(); track context.type) {
        <ng-container *ngComponentOutlet="context.type; inputs: {ribbon: this, element: context.element}"/>
      }
    </ng-ribbon>
  `,
  styleUrl: './ng-ribbon-wysiwyg.component.less'
})
export class NgRibbonWysiwygComponent {
  // Bindings
  public readonly editor = input<NgRibbonTextAreaComponent>();
  public readonly settings = input(new NgRibbonWysiwygSettings());

  public readonly ribbon = viewChild(NgRibbonComponent);
  public readonly mainContext = viewChild.required<NgRibbonContextComponent>('mainContext');

  public readonly mainContextHeader = contentChild<TemplateRef<void>>('mainContextHeader');
  public readonly homeGroupTemplate = contentChild<TemplateRef<{ index: number }>>('homeGroupTemplate');

  constructor() {
    inject(IconsService).configure();
  }

  // Contexts of the selected element and its ancestors (an image inside a table activates both)
  protected readonly activeContexts = computed(() => {
    const contexts: { type: Type<NgRibbonWysiwygContext>, element: Element }[] = [];
    // Contextual tabs (image, table...) only when the ribbon uses contexts
    if (!this.settings().useContexts) {
      return contexts;
    }

    for (let node = this.editor()?.activeElement; node; node = node.parentElement) {
      const tagName = node.tagName.toLowerCase();

      if (tagName == 'img') {
        contexts.push({type: NgRibbonImageContextComponent, element: node});
      } else if (tagName == 'table') {
        contexts.push({type: NgRibbonTableContextComponent, element: node});
      }
    }

    return contexts;
  });

  public execute(command: EditorCommands, value?: string) {
    this.editor().execute(command, value);
  }

  public isDisabled(command: EditorCommands): boolean {
    const editor = this.editor();
    return !editor || !editor.isCommandSupported(command);
  }
}
