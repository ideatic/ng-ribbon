# NgRibbon & NgRibbon WYSIWYG

Windows-like ribbon interface for Angular apps + WYSIWYG implementation using TinyMCE

*[Demo](https://ideatic.github.io/ng-ribbon/)*

## Development server

1. Clone this repo
2. Run `npm install`
3. Include this in your project's `angular.json`

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
                                "input": "./node_modules/tinymce/icons",
                                "output": "./assets/ribbon/vendor/tinymce/icons"
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

4. Run `ng serve` for a dev server.
5. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
