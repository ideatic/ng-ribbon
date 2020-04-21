import {Component, HostListener} from '@angular/core';

@Component({
  template: '<p>File menu</p>',
  styles: [`
    :host {
      display: block;
      background: white;
      max-width: 100%;
      width: 615px;
      border: 1px solid #c9d5e7;
    }
  `]
})
export class FileMenuComponent {

  public closeMenu = () => {

  };

  @HostListener('click')
  public onClick() {
    this.closeMenu();
  }
}
