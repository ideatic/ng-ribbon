import {NgModule} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {PortalModule} from "@angular/cdk/portal";
import {MatTooltipModule} from "@angular/material/tooltip";
import {OverlayModule} from "@angular/cdk/overlay";

/**
 * NgModule that includes all Material modules that are required to serve the app.
 */
@NgModule({
  exports: [
    OverlayModule,
    PortalModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
  ]
})
export class MaterialModule {
}
