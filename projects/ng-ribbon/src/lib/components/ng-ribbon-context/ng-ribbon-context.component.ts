import {Component, contentChild, inject, input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
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
  // Ribbon explícito, para contextos proyectados dentro de <ng-ribbon-wysiwyg>, donde la inyección no encuentra el <ng-ribbon> interno
  public readonly ribbonInput = input<NgRibbonComponent>(undefined, {alias: 'ribbon'});

  public readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  // Estado
  public tabs: NgRibbonTabComponent[] = [];

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
    this.tabs.push(tab);

    this.tabs = this.tabs.sort((a, b) => a.order() - b.order());

    if (tab.active()) {
      this.ribbon.selectTab(tab);
    }
  }

  public removeTab(tab: NgRibbonTabComponent) {
    const index = this.tabs.indexOf(tab);

    if (index >= 0) {
      // Seleccionar otra pestaña
      if (tab.active() && this.tabs.length > 1) {
        const newActiveIndex = index === this.tabs.length - 1 ? index - 1 : index + 1;
        this.ribbon.selectTab(this.tabs[newActiveIndex]);
      }

      this.tabs.splice(index, 1);
    }
  }

  public ngOnDestroy() {
    this.ribbon.removeContext(this);
  }
}

