import {Component, inject, input, output} from '@angular/core';
import {NgRibbonComponent, NgRibbonTabComponent} from "../../../public-api";

@Component({
  selector: 'ng-ribbon-group',
  template: `
    <div class="group-content">
      <ng-content/>
    </div>
    <div class="title">
      {{ name() }}

      @if (dialogLauncher()) {
        <button (click)="showDialog.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
            <path d="M1.7 8.3V1.6h6.6v1.7H10V0H0v10h4.2V8.3H1.7zM10 5L8.3 6.7 5.8 4.2 4.2 5.8l2.5 2.5L5 10h5V5z" fill="#939ba5"/>
          </svg>
        </button>
      }
    </div>
  `,
  styleUrl: 'ng-ribbon-group.component.less'
})
export class NgRibbonGroupComponent {
  // Bindings
  public readonly name = input<string>();
  public readonly dialogLauncher = input(false);
  public readonly showDialog = output();
}

