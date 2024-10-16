import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AutocompleteComponent} from "./components/autocomplete/autocomplete.component";
import {AutocompleteTrie} from './components/autocompleteTrie/autocompleteTrie.component';
import {AutocompleteTrieWebWorkerComponent} from './components/autocompleteTrieWebWorker/autocomplete-trie-web-worker.component.ts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AutocompleteTrie,
    AutocompleteComponent,
    AutocompleteTrieWebWorkerComponent
],
  template: `
    <div class="wrapper">

      <!-- <autocomplete /> -->
      <!-- <autocomplete-trie /> -->
      <app-autocomplete-trie-web-worker />

      </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
