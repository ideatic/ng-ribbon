# NgRibbon & NgRibbon WYSIWYG

A Microsoft Office-like ribbon toolbar for Angular, plus a rich text editor (TinyMCE 6) with a ready-made ribbon.

**[Live demo](https://ideatic.github.io/ng-ribbon/)**

This repo holds two libraries:

| Library | Path | What it gives you |
| --- | --- | --- |
| `ng-ribbon` | [`projects/ng-ribbon`](projects/ng-ribbon) | A generic ribbon: contexts, tabs and groups. You put your own buttons in it. |
| `ng-ribbon-wysiwyg` | [`projects/ng-ribbon-wysiwyg`](projects/ng-ribbon-wysiwyg) | A TinyMCE editor (`ng-ribbon-textarea`) and a ribbon for it (`ng-ribbon-wysiwyg`) with *Home* and *Insert* tabs: fonts, colors, paragraphs, lists, clipboard, search, undo, tables, images, links and symbols. |

The [`src/`](src) folder is the demo app.

## Requirements

- Angular 22, Angular Material and CDK 22
- `@angular/localize`
- For `ng-ribbon-wysiwyg`: `tinymce` 6.8, `tinymce-i18n` and `ngx-color` 10

All components are standalone and use signals. They work with or without zone.js.

## Installation

The libraries are not on npm. Add this repo to your project (for example as a git submodule) and import the source files:

```bash
git submodule add https://github.com/ideatic/ng-ribbon libs/ng-ribbon
```

Install the dependencies of your app:

```bash
npm install @angular/material @angular/cdk @angular/localize tinymce@^6.8 tinymce-i18n ngx-color
```

Load `@angular/localize/init` in the `polyfills` of your `angular.json`. Then copy the TinyMCE files and the ribbon images to your assets:

```json
"assets": [
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
    "input": "./node_modules/tinymce-i18n/langs6",
    "output": "./assets/ribbon/vendor/tinymce/langs"
  },
  {
    "glob": "**/*",
    "input": "libs/ng-ribbon/projects/ng-ribbon-wysiwyg/src/assets",
    "output": "./assets/ribbon/"
  }
]
```

The TinyMCE model, plugins and icons are bundled with the code, so you do not copy them.

If you serve the assets from another URL, set `assetsURL` in the ribbon settings and `base_url` in `tinyMceSettings` (see the example below).

## Usage

### Editor with ribbon

```ts
import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgRibbonWysiwygComponent} from '../libs/ng-ribbon/projects/ng-ribbon-wysiwyg/src/lib/components/ribbon/ng-ribbon-wysiwyg.component';
import {NgRibbonTextAreaComponent} from '../libs/ng-ribbon/projects/ng-ribbon-wysiwyg/src/lib/components/textarea/ng-ribbon-textarea.component';
import {NgRibbonWysiwygSettings} from '../libs/ng-ribbon/projects/ng-ribbon-wysiwyg/src/lib/components/ribbon/ng-ribbon-wysiwyg-settings';

@Component({
  selector: 'app-editor',
  imports: [NgRibbonWysiwygComponent, NgRibbonTextAreaComponent, FormsModule],
  template: `
    <ng-ribbon-wysiwyg [editor]="editor" [settings]="ribbonSettings"/>
    <ng-ribbon-textarea #editor [(ngModel)]="html" [tinyMceSettings]="{base_url: '/assets/ribbon/vendor/tinymce'}"/>
  `
})
export class EditorComponent {
  protected readonly html = signal('<p>Hello</p>');

  protected readonly ribbonSettings = new NgRibbonWysiwygSettings({
    mainTabName: 'File',
    assetsURL: '/assets/ribbon',
    onMainTabActive: (element) => console.log('Open your file menu next to', element)
  });
}
```

`ng-ribbon-textarea` is a form control: use it with `ngModel` or reactive forms.

Tip: use path aliases in `tsconfig.json` to make the imports shorter:

```json
"paths": {
  "@ng-ribbon/*": ["./libs/ng-ribbon/projects/ng-ribbon/*"],
  "@ng-ribbon-wysiwyg/*": ["./libs/ng-ribbon/projects/ng-ribbon-wysiwyg/*"]
}
```

### Add your own content to the editor ribbon

Put these templates inside `<ng-ribbon-wysiwyg>`:

```html
<ng-ribbon-wysiwyg #ribbon [editor]="editor" [settings]="ribbonSettings">
  <!-- Header above the tabs of the main context, for example the document title -->
  <ng-template #mainContextHeader>My document</ng-template>

  <!-- Groups inside the Home tab. index is the position: 0 (first) to 3 (last) -->
  <ng-template #homeGroupTemplate let-index="index">
    @if (index === 3) {
      <ng-ribbon-group name="My group">
        <button class="xl" (click)="save()">Save</button>
      </ng-ribbon-group>
    }
  </ng-template>

  <!-- More tabs in the main context. order sets the position -->
  <ng-ribbon-tab name="Review" [context]="ribbon.mainContext()" [order]="3">
    <ng-ribbon-group name="Check">…</ng-ribbon-group>
  </ng-ribbon-tab>

  <!-- An extra context, for example while an image is selected -->
  @if (imageSelected()) {
    <ng-ribbon-context name="Image" color="#f0f182" [ribbon]="ribbon.ribbon()">
      <ng-ribbon-tab name="Format">…</ng-ribbon-tab>
    </ng-ribbon-context>
  }
</ng-ribbon-wysiwyg>
```

Content inside `<ng-ribbon-wysiwyg>` cannot find the inner ribbon through dependency injection. So a tab needs `[context]="ribbon.mainContext()"`, and a context needs `[ribbon]="ribbon.ribbon()"`.

### Generic ribbon

```html
<ng-ribbon [settings]="settings" (tabSelected)="onTab($event)">
  <ng-ribbon-context name="Main">
    <ng-ribbon-tab name="Home" [active]="true">
      <ng-ribbon-group name="Clipboard" [dialogLauncher]="true" (showDialog)="openClipboard()">
        <button class="xl">Paste</button>
        <button class="sm">Cut</button>
        <button class="sm">Copy</button>
      </ng-ribbon-group>
    </ng-ribbon-tab>
    <ng-ribbon-tab name="View">…</ng-ribbon-tab>
  </ng-ribbon-context>
</ng-ribbon>
```

Import `NgRibbonComponent`, `NgRibbonContextComponent`, `NgRibbonTabComponent` and `NgRibbonGroupComponent` from [`projects/ng-ribbon/src/public-api.ts`](projects/ng-ribbon/src/public-api.ts). In a group, the `xl` class makes a big button and `sm` a small one.

## API

### Components

| Component | Inputs | Outputs |
| --- | --- | --- |
| `ng-ribbon` | `settings: NgRibbonSettings` | `tabSelected` |
| `ng-ribbon-context` | `name`, `color`, `ribbon` (only when it is not inside an `<ng-ribbon>`); template `#header` | |
| `ng-ribbon-tab` | `name`, `active` (two-way), `order`, `context` (only when it is not inside an `<ng-ribbon-context>`) | `selected` |
| `ng-ribbon-group` | `name`, `dialogLauncher` | `showDialog` |
| `ng-ribbon-wysiwyg` | `editor: NgRibbonTextAreaComponent`, `settings: NgRibbonWysiwygSettings`; templates `#mainContextHeader` and `#homeGroupTemplate` | |
| `ng-ribbon-textarea` | `tinyMceSettings` (merged with the defaults), `editorCSS` | `updateUI` |

`ng-ribbon-textarea` also has the methods `focus()`, `execute(command, value?)`, `queryValue(command)`, `queryBooleanValue(command)` and `isCommandSupported(command)`. The commands are in the `EditorCommands` enum.

### Settings

`NgRibbonSettings`:

| Property | Default | Description |
| --- | --- | --- |
| `mainTabName` | none | Text of the first, highlighted tab (like *File* in Office). `false` hides it. |
| `onMainTabActive` | no-op | Called with the tab element when the user clicks the main tab. |
| `useContexts` | `true` | Show the context headers above the tabs. |
| `mouseWheelTabs` | `true` | The mouse wheel over the ribbon changes the tab. |

`NgRibbonWysiwygSettings` adds:

| Property | Default | Description |
| --- | --- | --- |
| `showHomeTab` | `true` | Show the *Home* tab. |
| `showInsertTab` | `true` | Show the *Insert* tab. |
| `assetsURL` | `/assets/ribbon` | URL of the ribbon images. |
| `font.families`, `font.sizes` | Common fonts, 8 to 36 pt | Choices of the font menus. |

## Theming

Each color is a CSS custom property, with the light theme as the fallback. Set them on a parent element, for example for a dark theme:

| Property | Used for |
| --- | --- |
| `--bg-color` | Background of the active tab, the inputs and the editor |
| `--ribbon-bg-color` | Background of the ribbon |
| `--ribbon-border-color` | Borders |
| `--ribbon-tab-hover-bg`, `--ribbon-tab-hover-border` | Tab under the mouse |
| `--ribbon-active-tab-color` | Text of the active tab |
| `--ribbon-hover-bg`, `--ribbon-active-bg`, `--ribbon-active-hover-bg` | Buttons under the mouse, pressed or both |
| `--ribbon-input-border-color`, `--ribbon-input-hover-border-color` | Inputs and selects |
| `--ribbon-divider-color` | Lines between groups |
| `--ribbon-panel-bg` | Background of the symbol list |
| `--ribbon-muted-color` | Titles in the symbol list |
| `--ribbon-disabled-color` | Disabled buttons |

## Localization

The text of the ribbon is in Spanish and marked with `$localize`. To show it in another language, translate it with the [Angular i18n](https://angular.dev/guide/i18n) tools of your app. The TinyMCE language follows `LOCALE_ID`; its files come from `tinymce-i18n`.

## Development

1. `npm install`
2. `npm start` runs the demo at <http://localhost:4200/>.
3. `npm run build` builds the demo into `demo/`. Then move `demo/index.html` to the root `index.html` and commit both. GitHub Pages serves the root of the `main` branch.
