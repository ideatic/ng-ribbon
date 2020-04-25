import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";
import {NgRibbonSettings} from "./ng-ribbon-settings";
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";

@Component({
  selector: 'ng-ribbon',
  template: `
    <div class="contexts" [ngStyle]="{borderColor: selectedTab?.context.color || '#dadbdc'}">
      <div class="context" *ngFor="let context of contexts; first as firstContext" [ngStyle]="{backgroundColor: context.color}">
        <div *ngIf="settings.useContexts" class="context-header">
          <ng-template [ngIf]="context.headerTemplate" [ngTemplateOutlet]="context.headerTemplate"
                       [ngIfElse]="contextNameTemplate"></ng-template>
          <ng-template #contextNameTemplate>{{ context.name }}</ng-template>
        </div>

        <ul role="tablist">
          <li *ngIf="firstContext && settings.mainTabName" #mainTab role="button" class="main">
            <a (click)="settings.onMainTabActive(mainTab)">{{ settings.mainTabName }}</a>
          </li>
          <li *ngFor="let tab of context.tabs"
              role="tab" [attr.aria-selected]="tab.active"
              [class.active]="tab.active">
            <a (click)="selectTab(tab)">{{ tab.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="ribbon-content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['ng-ribbon.component.less']
})
export class NgRibbonComponent {
  @Input() public settings = new NgRibbonSettings();
  @Output() public tabSelected: EventEmitter<NgRibbonTabComponent> = new EventEmitter();

  public contexts: NgRibbonContextComponent[] = [];

  public selectedTab: NgRibbonTabComponent;

  public selectTab(tab: NgRibbonTabComponent) {
    // Enable tab
    tab.showed = true;
    this.contexts.forEach(context => context.tabs.forEach(t => t.active = t == tab));
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

      const hasActiveTab = this.contexts.find(context => context.tabs.find(t => t.active));
      if (!hasActiveTab && this.contexts.length && this.contexts[0].tabs.length) {
        this.selectTab(this.contexts[0].tabs[0]);
      }
    }
  }
}

