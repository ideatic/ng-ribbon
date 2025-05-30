import {Component, OnInit, inject} from '@angular/core';
import {NgRibbonWysiwygSettings} from "../../../projects/ng-ribbon-wysiwyg/src/lib/components/ribbon/ng-ribbon-wysiwyg-settings";
import {ConnectionPositionPair, Overlay} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {FileMenuComponent} from "./file-menu.component";
import {Title} from "@angular/platform-browser";
import {environment} from "../../environments/environment";
import {RawEditorSettings} from "tinymce";
import {NgRibbonWysiwygComponent} from '../../../projects/ng-ribbon-wysiwyg/src/lib/components/ribbon/ng-ribbon-wysiwyg.component';
import {NgRibbonTextAreaComponent} from '../../../projects/ng-ribbon-wysiwyg/src/lib/components/textarea/ng-ribbon-textarea.component';
import {FormsModule} from '@angular/forms';
import {NgRibbonContextComponent, NgRibbonGroupComponent, NgRibbonTabComponent} from "../../../projects/ng-ribbon/src/public-api";


@Component({
  selector: 'app-root',
  imports: [NgRibbonWysiwygComponent, NgRibbonGroupComponent, NgRibbonContextComponent, NgRibbonTabComponent, NgRibbonTextAreaComponent, FormsModule],
  template: `
    <!-- Ribbon -->
    <ng-ribbon-wysiwyg #ribbon [settings]="ribbonSettings" [editor]="editor">
      @if (mainContextVisible) {
        <ng-template #mainContextHeader>
          <div contenteditable [textContent]="documentTitle"
               (input)="documentTitle = $any($event.target).textContent; onTitleUpdated();"
               style="outline: none"></div>
        </ng-template>
      }


      <ng-container ngProjectAs="homeTabGroup3">
        <ng-ribbon-group name="Demo">
          <button class="xl animate-pulse" mat-button (click)="mainContextVisible = !mainContextVisible">
            <img src="{{ environment.assetsURL }}/images/toggle.png"/>
            <div i18n>Toggle main context</div>
          </button>
          <button class="xl animate-pulse" mat-button (click)="showImageContext = !showImageContext">
            <img src="{{ environment.assetsURL }}/images/toggle.png"/>
            <div i18n>Toggle image context</div>
          </button>
        </ng-ribbon-group>
      </ng-container>

      @if (showImageContext) {
        <ng-ribbon-context name="Imagen" i18n-name color="#f0f182" [ribbon]="ribbon.ribbon">
          <ng-ribbon-tab name="Formato" i18n-name>
            <ng-ribbon-group name="Ajustar" i18n-name>
              <!-- Posición -->
              <button class="xl" mat-button
                      title="Cambia la imagen seleccionada por una diferente" i18n-title>
                <img src="{{ environment.assetsURL }}/images/picture.png"/>
                <div i18n>Reemplazar</div>
              </button>
            </ng-ribbon-group>
          </ng-ribbon-tab>
        </ng-ribbon-context>
      }

    </ng-ribbon-wysiwyg>

    <!-- Editor -->
    <div class="textarea-wrapper">
      <div class="textarea">
        <ng-ribbon-textarea #editor [(ngModel)]="html" [tinyMceSettings]="tinyMceSettings"></ng-ribbon-textarea>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      :host ::ng-deep ng-ribbon-group {
        height: 105px;
      }


      .textarea-wrapper {
        width: 100%;
        flex-grow: 1;
        padding: 10px;
      }

      .textarea {
        max-width: 210mm;
        width: 100%;
        height: 297mm;
        background: white;
        border: 1px solid #c6c6c6;
        padding: 2.54cm;
        margin: 0 auto;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  private _overlaySvc = inject(Overlay);
  private _titleSvc = inject(Title);

  public documentTitle = $localize`Demo`;
  public html = `<h1>Welcome to <em>NgRibbon</em></h1>
<h3>Windows-like ribbon interface for Angular apps + WYSIWYG implementation using TinyMCE</h3>

<h4>Usage</h4>
<ol>
<li>Clone this repo: <a href="https://github.com/ideatic/ng-ribbon" target="_blank">https://github.com/ideatic/ng-ribbon</a></li>
<li>Run <code>npm install</code></li>
<li>Include this in your project's <code>angular.json</code><br/>
<pre>
    "assets": [
              ...
              {
                "glob": "**/*",
                "input": "./node_modules/tinymce/skins",
                "output": "./assets/ribbon/vendor/tinymce/skins"
              },
              {
                "glob": "**/*",
                "input": "./node_modules/tinymce/themes",
                "output": "./assets/ribbon/vendor/tinymce/themes"
              },
              {
                "glob": "**/*",
                "input": "./node_modules/tinymce-i18n/langs5",
                "output": "./assets/ribbon/vendor/tinymce/langs"
              },
              {
                "glob": "**/*",
                "input": "projects/ng-ribbon-wysiwyg/src/assets",
                "output": "./assets/ribbon/"
              }
            ]
</pre>
</li>
<li>Run <code>ng serve</code> for a dev server</li>
<li>Navigate to http://localhost:4200/</li>
</ol>`;

  public mainContextVisible = true;
  public showImageContext = false;

  public ribbonSettings = new NgRibbonWysiwygSettings({
    mainTabName: $localize`Archivo`,
    assetsURL: environment.assetsURL + '/ribbon',
    onMainTabActive: (element) => this._showFileMenu(element)
  });

  public tinyMceSettings: RawEditorSettings = {
    base_url: environment.assetsURL + '/ribbon/vendor/tinymce'
  };

  public readonly environment = environment;

  public ngOnInit() {
    setTimeout(() => this.showImageContext = true, 1000);

    this.onTitleUpdated();
  }

  public onTitleUpdated() {
    this._titleSvc.setTitle(`${this.documentTitle} - NgRibbon`);
  }

  private _showFileMenu(element: HTMLElement) {
    const overlayRef = this._overlaySvc.create({
        hasBackdrop: true,
        positionStrategy: this._overlaySvc.position()
          .flexibleConnectedTo(element)
          .withPositions([
            new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'}),
            new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'})
          ]),
        scrollStrategy: this._overlaySvc.scrollStrategies.block(),
      }
    );
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    const componentRef = overlayRef.attach(new ComponentPortal(FileMenuComponent));
    componentRef.instance.closeMenu = () => {
      componentRef.destroy();
      overlayRef.detach();
      overlayRef.dispose();
    };
  }
}
