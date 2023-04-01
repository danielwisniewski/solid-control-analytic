import { Component } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  template: `
    <ng-template let-row="row" let-value="value" #building>
      <span>{{ formatValue(value) }}</span>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: #0ff;
        padding: 12px;
        border-radius: 8px;
      }
    `,
  ],
})
export class DynamicComponent {
  time = new Date();

  formatValue(value: any) {
    if (value._kind && value._kind === 'ref') return value.dis;
    return value;
  }
}
