import {Component, inject} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {NgRibbonGroupComponent} from "../../../../../../ng-ribbon/src/lib/components/ng-ribbon-group/ng-ribbon-group.component";
import {SymbolListComponent} from "../components/symbol-list.component";
import {NgRibbonTabComponent} from "../../../../../../ng-ribbon/src/public-api";
import {noop} from "rxjs";
import {DomUtilsService} from "../../../services/dom-utils.service";
import {NgRibbonWysiwygComponent} from "../../../../public-api";
import {EditorCommands} from "../../textarea/editor-commands";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'ng-ribbon-insert-tab',
  imports: [
    MatRipple,
    MatIcon,
    MatTooltip,
    NgRibbonGroupComponent,
    SymbolListComponent,
    NgRibbonTabComponent
  ],
  template: `
    <ng-ribbon-tab #ribbonTab name="Insertar" i18n-name [order]="2">
      <ng-ribbon-group name="Elementos" i18n-name>
        <button class="xl" matRipple (click)="ribbon.execute(Commands.insertHTML, defaultTable)" [disabled]="ribbon.isDisabled(Commands.insertHTML)"
                matTooltip="Inserta una tabla al documento." i18n-matTooltip>
          <mat-icon svgIcon="table"></mat-icon>
          <div i18n>Tabla</div>
        </button>
        <button class="xl" matRipple (click)="insertImage()" [disabled]="ribbon.isDisabled(Commands.insertHTML)"
                matTooltip="Incluye una imagen al documento desde un archivo local." i18n-matTooltip>
          <img src="{{ ribbon.settings().assetsURL }}/images/picture.png"/>
          <div i18n>Imagen</div>
        </button>
        <button class="xl" matRipple (click)="ribbon.execute(Commands.createLink)" [disabled]="ribbon.isDisabled(Commands.createLink)"
                matTooltip="Crea un vínculo en el documento para el acceso rápido a páginas web y otros archivos." i18n-matTooltip>
          <img src="{{ ribbon.settings().assetsURL }}/images/link.png"/>
          <div i18n>Enlace</div>
        </button>
        <!--  <button class="xl" matRipple (click)="insertChart()"
        matTooltip="Insertar un gráfico donde mostrar y comparar datos usando la API de Google." i18n-matTooltip>
        <img src="{{ settings.assetsURL }}/images/chart.png"/>
        <div i18n>Gráfico</div>
      </button> -->
        <button class="xl" matRipple (click)="ribbon.execute(Commands.insertHorizontalRule)" [disabled]="ribbon.isDisabled(Commands.insertHorizontalRule)"
                matTooltip="Inserta una línea horizontal que separa dos secciones del documento." i18n-matTooltip>
          <img src="{{ ribbon.settings().assetsURL }}/images/horizontal-line.png"/>
          <div i18n>Separador</div>
        </button>
        <button class="xl" matRipple (click)="ribbon.execute(Commands.insertHTML, defaultQuote)" [disabled]="ribbon.isDisabled(Commands.insertHTML)"
                matTooltip="Inserta una cita en el documento." i18n-matTooltip>
          <img src="{{ ribbon.settings().assetsURL }}/images/quote.png"/>
          <div i18n>Cita</div>
        </button>
      </ng-ribbon-group>
      @if (ribbonTab.showed()) {
        <ng-ribbon-group name="Símbolos" i18n-name>
          <symbol-list (symbolSelected)="ribbon.execute(Commands.insertText, $event)" [disabled]="ribbon.isDisabled(Commands.insertText)"/>
        </ng-ribbon-group>
      }
    </ng-ribbon-tab>
  `
})
export class NgRibbonInsertTabComponent {
  // Deps
  protected readonly ribbon = inject(NgRibbonWysiwygComponent);
  private readonly _domUtils = inject(DomUtilsService);

  // Importar tipos en la plantilla
  protected readonly Commands = EditorCommands;

  // Estado
  protected readonly defaultTable = `<table>
<thead>
<tr><th></th><th></th></tr>
</thead>
<tbody>
<tr><td></td><td></td></tr>
<tr><td></td><td></td></tr>
</tbody>
</table>`;
  protected readonly defaultQuote = `<blockquote>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a ante ut purus aliquam pellentesque. Suspendisse potenti. In sit amet risus quam, et egestas mauris. Nunc feugiat risus ut est facilisis condimentum. Sed et turpis velit, sit amet pharetra lacus.</blockquote>`;


  protected insertImage() {
    this._domUtils.uploadAsDataURL("image/*")
      .then(
        (image) => this.ribbon.execute(EditorCommands.insertHTML, `<img src="${image}" />`),
        noop
      );
  }

  protected insertChart() {
    throw new Error('Not implemented');
  }
}
