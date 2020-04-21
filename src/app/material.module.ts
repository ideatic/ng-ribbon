import {NgModule} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
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
