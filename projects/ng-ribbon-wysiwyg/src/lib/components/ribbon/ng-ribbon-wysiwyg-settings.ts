import {NgRibbonSettings} from "../../../../../ng-ribbon/src/lib/components/ng-ribbon/ng-ribbon-settings";

export class NgRibbonWysiwygSettings extends NgRibbonSettings {
  public showHomeTab = true;
  public showInsertTab = true;

  public assetsURL = '/assets/ribbon';

  public fontFamilies = ["Arial", "Calibri", "Cambria", "Segoe UI",
    "Courier New", "Georgia", "Times New Roman",
    "Trebuchet MS", "Verdana", "Tahoma", "Microsoft Sans Serif"];

  constructor(settings?: Partial<NgRibbonWysiwygSettings>) {
    super(settings);

    if (settings) {
      Object.assign(this, settings);
    }
  }
}
