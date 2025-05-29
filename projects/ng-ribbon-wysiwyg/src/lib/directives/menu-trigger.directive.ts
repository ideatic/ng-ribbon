import {Directive, ElementRef, EmbeddedViewRef, HostListener, inject, Injector, input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {ConnectionPositionPair, createBlockScrollStrategy, createFlexibleConnectedPositionStrategy, createOverlayRef, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Directive({selector: '[menuTriggerFor]'})
export class MenuTriggerDirective implements OnDestroy {
  // Deps
  private readonly _injector = inject(Injector);
  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _viewContainerRef = inject(ViewContainerRef);

  // Bindings
  public readonly menuTriggerFor = input<TemplateRef<any>>(undefined);

  // Estado
  private _overlayRef: OverlayRef;
  private _embeddedViewRef: EmbeddedViewRef<any>;

  @HostListener('click')
  protected onClick() {
    const overlayRef = createOverlayRef(this._injector, {
        hasBackdrop: true,
        backdropClass: '',
        positionStrategy: createFlexibleConnectedPositionStrategy(this._injector, this._host)
          .withPositions([
            new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'}),
            new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'})
          ]),
        scrollStrategy: createBlockScrollStrategy(this._injector),
      }
    );
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    const templatePortal = new TemplatePortal(this.menuTriggerFor(), this._viewContainerRef);
    this._embeddedViewRef = overlayRef.attach(templatePortal);
  }


  public ngOnDestroy() {
    this._embeddedViewRef?.destroy();

    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }
  }
}

