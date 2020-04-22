import {NgRibbonSettings} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon/ng-ribbon-settings";

export class NgRibbonWysiwygSettings extends NgRibbonSettings {
  public showHomeTab = true;
  public showInsertTab = true;

  public assetsURL = '/assets/ribbon';

  public font = {
    families: ["Arial", "Calibri", "Cambria", "Segoe UI", "Courier New", "Georgia", "Times New Roman", "Trebuchet MS", "Verdana", "Tahoma", "Microsoft Sans Serif"],
    sizes: [8, 10, 12, 14, 18, 24, 36]
  };

  constructor(settings?: Partial<NgRibbonWysiwygSettings>) {
    super(settings);

    if (settings) {
      Object.assign(this, settings);
    }
  }
}
