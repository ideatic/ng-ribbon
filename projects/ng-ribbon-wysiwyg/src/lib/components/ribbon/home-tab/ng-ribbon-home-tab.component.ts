import {Component} from '@angular/core';
import {NgRibbonWysiwygComponent} from "../ng-ribbon-wysiwyg.component";
import {EditorCommands} from "../../textarea/editor-commands";
import {IconsService} from "../../../services/icons.service";

@Component({
    selector: 'ng-ribbon-home-tab',
    templateUrl: './ng-ribbon-home-tab.component.html',
    styleUrls: ['./ng-ribbon-home-tab.component.less'],
    standalone: false
})
export class NgRibbonHomeTabComponent {
    public backColor = 'yellow';
    public foreColor = 'red';

    // Importar tipos
    public readonly Commands = EditorCommands;

    constructor(public ribbon: NgRibbonWysiwygComponent) {
    }

    public execute(command: EditorCommands, value?: any) {
        this.ribbon.editor.execute(command, value);
    }

    public isActive(command: EditorCommands): boolean {
        return this.ribbon.editor.queryBooleanValue(command);
    }

    public isDisabled(command: EditorCommands): boolean {
        return !this.ribbon.editor.isCommandSupported(command);
    }
}
