import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {AutocompleteComponent} from "./components/autocomplete/autocomplete.component";
import {AutocompleteTrie} from './components/autocompleteTrie/autocompleteTrie.component';
import {AutocompleteTrieWebWorker} from "./components/autocompleteTrieWebWorker/autocompleteTrieWebWorker";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AutocompleteTrie,
    AutocompleteComponent,
    AutocompleteTrieWebWorker
],
  template: `
    <div class="wrapper">

      <!-- <autocomplete /> -->
      <!-- <autocomplete-trie /> -->
      <autocomplete-trie-web-worker />

      </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
