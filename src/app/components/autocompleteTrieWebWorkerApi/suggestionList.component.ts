import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy,Component,Input} from '@angular/core';

@Component({
  selector: 'suggestion-list',
  imports: [CommonModule],
  standalone: true,
  template: `
    <ul>
      @for (suggestion of suggestions; track suggestion) {
        <li>{{ suggestion }}</li>
      } @empty {
        <p> Case sensitive search </p> 
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestionListComponent {
  @Input() suggestions: string[] = [];
}