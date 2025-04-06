import {Directive, ElementRef, EmbeddedViewRef, HostListener, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {ConnectionPositionPair, Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Directive({ selector: '[menuTriggerFor]' })
export class MenuTriggerDirective implements OnDestroy {
  @Input() public menuTriggerFor: TemplateRef<any>;

  private _overlayRef: OverlayRef;
  private _embeddedViewRef: EmbeddedViewRef<any>;

  constructor(private _overlaySvc: Overlay,
              private _host: ElementRef<HTMLElement>,
              private _viewContainerRef: ViewContainerRef) {
  }

  @HostListener('click')
  public onClick() {
    const overlayRef = this._overlaySvc.create({
        hasBackdrop: true,
        backdropClass: '',
        positionStrategy: this._overlaySvc.position()
          .flexibleConnectedTo(this._host)
          .withPositions([
            new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'}),
            new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'})
          ]),
        scrollStrategy: this._overlaySvc.scrollStrategies.block(),
      }
    );
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    const templatePortal = new TemplatePortal(this.menuTriggerFor, this._viewContainerRef);
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

