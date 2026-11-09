import {Component, contentChild, inject, input, OnDestroy, OnInit, signal, TemplateRef} from '@angular/core';
import {NgRibbonComponent} from "../ng-ribbon/ng-ribbon.component";
import {NgRibbonTabComponent} from "../ng-ribbon-tab/ng-ribbon-tab.component";

@Component({
  selector: 'ng-ribbon-context',
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
    }
  `
})
export class NgRibbonContextComponent implements OnInit, OnDestroy {
  // Deps
  private readonly _parentRibbon = inject(NgRibbonComponent, {optional: true});

  // Bindings
  public readonly name = input<string>();
  public readonly color = input<string>();
  // Explicit ribbon, for contexts projected inside <ng-ribbon-wysiwyg>, where injection does not find the inner <ng-ribbon>
  public readonly ribbonInput = input<NgRibbonComponent>(undefined, {alias: 'ribbon'});

  public readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  // State
  // Signal: the tab headers of the ribbon repaint when a tab is added or removed after the first render
  public readonly tabs = signal<NgRibbonTabComponent[]>([]);

  protected get ribbon(): NgRibbonComponent {
    const ribbon = this.ribbonInput() ?? this._parentRibbon;
    if (!ribbon) {
      throw new Error('ng-ribbon-context needs a parent ng-ribbon or a [ribbon] input');
    }
    return ribbon;
  }

  public ngOnInit() {
    this.ribbon.addContext(this);
  }

  public addTab(tab: NgRibbonTabComponent) {
    this.tabs.update(tabs => [...tabs, tab].sort((a, b) => a.order() - b.order()));

    if (tab.active()) {
      this.ribbon.selectTab(tab);
    }
  }

  public removeTab(tab: NgRibbonTabComponent) {
    const tabs = this.tabs();
    const index = tabs.indexOf(tab);

    if (index >= 0) {
      // Select another tab
      if (tab.active() && tabs.length > 1) {
        const newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
        this.ribbon.selectTab(tabs[newActiveIndex]);
      }

      this.tabs.update(tabs => tabs.filter(t => t !== tab));
    }
  }

  public ngOnDestroy() {
    this.ribbon.removeContext(this);
  }
}

