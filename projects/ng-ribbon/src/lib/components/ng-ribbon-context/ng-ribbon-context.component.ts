import {Component, OnDestroy, OnInit, TemplateRef, inject, contentChild, input} from '@angular/core';
import {NgRibbonComponent} from "../ng-ribbon/ng-ribbon.component";
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";

@Component({
  selector: 'ng-ribbon-context',
  template: '<ng-content />',
  styles: [
    `:host {
      display: block;
    }`
  ]
})
export class NgRibbonContextComponent implements OnInit, OnDestroy {
  // Bindings
  public readonly name = input<string>();
  public readonly color = input<string>();
  public readonly ribbon = input<NgRibbonComponent>(inject(NgRibbonComponent, {optional: true}));

  public readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  // Estado
  public tabs: NgRibbonTabComponent[] = [];

  public ngOnInit() {
    const ribbon = this.ribbon();
    if (!ribbon) {
      throw new Error(`Parent ribbon not found for context '${this.name()}'`);
    }

    ribbon.addContext(this);
  }

  public ngOnDestroy() {
    this.ribbon().removeContext(this);
  }

  public addTab(tab: NgRibbonTabComponent) {
    this.tabs.push(tab);

    this.tabs = this.tabs.sort((a, b) => a.order() - b.order());

    if (tab.active()) {
      this.ribbon().selectTab(tab);
    }
  }

  public removeTab(tab: NgRibbonTabComponent) {
    const index = this.tabs.indexOf(tab);

    if (index >= 0) {
      // Seleccionar otra pestaña
      if (tab.active() && this.tabs.length > 1) {
        const newActiveIndex = index === this.tabs.length - 1 ? index - 1 : index + 1;
        this.ribbon().selectTab(this.tabs[newActiveIndex]);
      }

      this.tabs.splice(index, 1);
    }
  }
}

