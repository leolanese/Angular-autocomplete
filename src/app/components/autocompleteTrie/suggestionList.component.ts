import {CommonModule} from '@angular/common';
import {Component,Input} from '@angular/core';

@Component({
  selector: 'suggestion-list',
  standalone: true,
  template: `
    <ul>
      <li *ngFor="let suggestion of suggestions">{{ suggestion }}</li>
    </ul>
  `,
  imports: [CommonModule]
})
export class SuggestionListComponent {
  @Input() suggestions: string[] = [];

   trackByIndex(index: number, item: string): number {
    return index;
  }
}