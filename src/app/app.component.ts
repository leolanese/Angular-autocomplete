import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
// import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import {AutocompleteTrie} from './components/autocompleteTrie/autocompleteTrie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AutocompleteTrie
  ],
  template: `
    <div class="wrapper">
        <autocomplete-trie />
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
