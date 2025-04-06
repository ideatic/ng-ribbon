import {NgModule} from "@angular/core";
import {OverlayModule} from "@angular/cdk/overlay";
import {MatButtonModule} from "@angular/material/button";

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
