import {Component, inject, input, model, OnDestroy, OnInit, output, signal} from '@angular/core';
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";

@Component({
  selector: 'ng-ribbon-tab',
  template: '<ng-content />',
  host: {
    role: 'tabpanel',
    '[class.active]': 'active()'
  },
  styles: `
    @import "../theme.less";

    :host {
      border-bottom: 1px solid @borderColor;
      justify-content: flex-start;
      padding: 4px;
      overflow-x: auto;
      flex-wrap: nowrap;
      scrollbar-width: thin;
      display: none;

      &.active {
        display: block;
        display: flex;
      }
    }
  `
})
export class NgRibbonTabComponent implements OnInit, OnDestroy {
  // Bindings
  public readonly active = model<boolean>();
  public readonly name = input<string>();
  public readonly context = input<NgRibbonContextComponent>(inject(NgRibbonContextComponent, {optional: true}));
  public readonly order = input(0);

  // Events
  public readonly selected = output<NgRibbonTabComponent>();

  /**
   * Indicates if this tab has been showed
   */
  public showed = signal(false);

  public ngOnInit() {
    const context = this.context();
    if (!context) {
      throw new Error(`Parent context not found for tab '${this.name()}'`);
    }

    context.addTab(this);
  }

  public ngOnDestroy() {
    this.context().removeTab(this);
  }
}

