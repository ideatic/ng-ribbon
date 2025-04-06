import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-symbol-list',
    template: `
    @for (category of symbols; track category) {
      <div>
        <h3>{{ category.name }}</h3>
        @for (symbol of category.symbols; track symbol) {
          <button
          mat-button (click)="symbolSelected.emit(symbol)" [disabled]="disabled">{{ symbol }}</button>
        }
      </div>
    }
    `,
    styles: [`
    :host {
      display: block;
      max-height: 75px;
      min-width: 200px;
      max-width: 700px;
      overflow-y: scroll;
      background: #fafbfc;
      border: 1px solid #dbdcdd;
      padding: 5px;
    }

    div {
      margin-bottom: 10px;
    }

    h3 {
      color: rgba(0, 0, 0, .54);
      font-size: 14px;
      margin: 0 0 5px 0;
      border-bottom: 1px solid rgba(0, 0, 0, .14);
    }

    button {
      font-size: 40px;
      padding: 0 10px;
      margin-bottom: 10px;
      width: 40px;
      max-width: 40px;
    }
  `],
    standalone: false
})
export class SymbolListComponent {
  @Input() public disabled = false;
  @Output() public symbolSelected = new EventEmitter<string>();

  public readonly symbols = [
    {
      name: $localize`Letras griegas`,
      symbols: ["α", "β", "Γ", "γ", "Δ", "δ", "ε", "ζ", "η", "Θ", "θ", "ι", "κ", "Λ", "λ", "μ", "ν", "Ξ", "Xi", "ο", "Π", "π", "ρ", "Σ", "σ", "τ", "υ", "Φ", "φ", "χ", "Ψ", "ψ", "Ω", "ω"]
    },
    {
      name: $localize`Matemáticas`,
      symbols: ["¹", "²", "³", "ⁿ", "‰", "∂", "∫", "∆", "∑", "∏", "√", "∞", "∩", "⅞", "≈", "≠", "≤", "≥", "÷", "½", "⅓", "⅔", "¼", "¾", "⅛", "⅜", "⅝"]
    },
    {
      name: $localize`Flechas`,
      symbols: ["←", "↑", "→", "↓", "↔", "↕"]
    },
    {
      name: $localize`Varios`,
      symbols: ["•", "♪", "♫", "♀", "♂", "♠", "♣", "♥", "♦", "©", "®", "™", "¬"]
    },
    {
      name: $localize`Divisas`,
      symbols: ["€", "$", "£", "¢", "¥", "¤", "₧", "₨", "￦"]
    },
  ]
}
