import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import {NgRibbonContextComponent} from "../ng-ribbon-context/ng-ribbon-context.component";

@Component({
    selector: 'ng-ribbon-tab',
    template: '<ng-content></ng-content>',
    host: {
        role: 'tabpanel'
    },
    styleUrls: ['ng-ribbon-tab.component.less']
})
export class NgRibbonTabComponent implements OnInit, OnDestroy {
  // Bindings
  @HostBinding('class.active')
  @Input() public active: boolean;
  @Input() public name: string;
  @Input() public context: NgRibbonContextComponent;
  @Input() public order = 0;

  // Events
  @Output() public selected: EventEmitter<NgRibbonTabComponent> = new EventEmitter();

  /**
   * Indicates if this tab has been showed
   */
  public showed = false;

  constructor() {
    const context = inject(NgRibbonContextComponent, { optional: true })!;

    this.context = context;
  }

  public ngOnInit() {
    if (!this.context) {
      throw new Error(`Parent context not found for tab '${this.name}'`);
    }

    this.context.addTab(this);
  }

  public ngOnDestroy() {
    this.context.removeTab(this);
  }
}

