import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AutocompleteComponent} from "./components/autocomplete/autocomplete.component";
import {AutocompleteTrie} from './components/autocompleteTrie/autocompleteTrie.component';
import {AutocompleteTrieWebWorkerApiComponent} from './components/autocompleteTrieWebWorkerApi/autocomplete-trie-web-worker-api.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AutocompleteTrie,
    AutocompleteComponent,
    AutocompleteTrieWebWorkerApiComponent
],
  template: `
    <div class="wrapper">

      <!-- <autocomplete /> -->
      <!-- <autocomplete-trie /> -->
      <!-- <app-autocomplete-trie-web-worker /> -->
      <app-autocomplete-trie-web-worker-api />

      </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
