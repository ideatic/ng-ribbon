import {NgModule} from "@angular/core";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {OverlayModule} from "@angular/cdk/overlay";

/**
 * NgModule that includes all Material modules that are required to serve the app.
 */
@NgModule({
  exports: [
    OverlayModule,
    MatButtonModule
  ]
})
export class MaterialModule {
}
