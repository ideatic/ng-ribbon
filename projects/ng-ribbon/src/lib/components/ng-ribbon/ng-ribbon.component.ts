import {ChangeDetectionStrategy, Component, HostListener, input, output} from '@angular/core';
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";
import {NgRibbonSettings} from "./ng-ribbon-settings";
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'ng-ribbon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div class="contexts" [style.border-color]="selectedTab?.context().color() ?? '#dadbdc'">
      @for (context of contexts; track context; let firstContext = $first) {
        <div class="context" [style.background-color]="context.color()">
          @if (settings().useContexts) {
            <div class="context-header">
              @if (context.headerTemplate()) {
                <ng-container [ngTemplateOutlet]="context.headerTemplate()"/>
              } @else {
                {{ context.name() }}
              }
            </div>
          }
          <ul role="tablist">
            @if (firstContext && settings().mainTabName) {
              <li #mainTab role="button" class="main">
                <a (click)="settings().onMainTabActive(mainTab)">{{ settings().mainTabName }}</a>
              </li>
            }
            @for (tab of context.tabs; track tab) {
              <li role="tab" [attr.aria-selected]="tab.active()" [class.active]="tab.active()">
                <a (click)="selectTab(tab)">{{ tab.name() }}</a>
              </li>
            }
          </ul>
        </div>
      }
    </div>
    <div class="ribbon-content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: 'ng-ribbon.component.less'
})
export class NgRibbonComponent {
  // Bindings
  public readonly settings = input(new NgRibbonSettings());
  public readonly tabSelected = output<NgRibbonTabComponent>();

  // Estado
  public contexts: NgRibbonContextComponent[] = [];

  public selectedTab: NgRibbonTabComponent;

  public selectTab(tab: NgRibbonTabComponent) {
    // Enable tab
    tab.showed.set(true);
    this.contexts.forEach(c => c.tabs.forEach(t => t.active.set(t == tab)));
    this.selectedTab = tab;

    // Fire events
    tab.selected.emit(tab);
    this.tabSelected.emit(tab);
  }

  public addContext(context: NgRibbonContextComponent) {
    this.contexts.push(context);

    if (this.contexts.length === 1 && context.tabs.length) {
      this.selectTab(context.tabs[0]);
    }
  }

  public removeContext(context: NgRibbonContextComponent) {
    const index = this.contexts.indexOf(context);

    if (index >= 0) {
      this.contexts.splice(index, 1);

      const hasActiveTab = this.contexts.find(context => context.tabs.find(t => t.active()));
      if (!hasActiveTab && this.contexts.length && this.contexts[0].tabs.length) {
        this.selectTab(this.contexts[0].tabs[0]);
      }
    }
  }

  @HostListener('wheel', ['$event'])
  private _onWheel($event: WheelEvent) {
    if (this.settings().mouseWheelTabs) {
      if ($event.deltaY > 0) { // Select next tab
        let selectCurrentTab = false;
        this.contexts.forEach(c => c.tabs.forEach(t => {
          if (t == this.selectedTab) {
            selectCurrentTab = true;
          } else if (selectCurrentTab) {
            this.selectTab(t);
            selectCurrentTab = false;
          }
        }));
      } else if ($event.deltaY < 0) { // Select previous tab
        let prevTab = null;
        let selectTab = null;
        this.contexts.forEach(c => c.tabs.forEach(t => {
          if (t == this.selectedTab) {
            selectTab = prevTab;
          }
          prevTab = t;
        }));

        if (selectTab) {
          this.selectTab(selectTab);
        }
      }

      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}

