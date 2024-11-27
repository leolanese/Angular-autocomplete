import {Component} from '@angular/core';

import {AutoCompleteSmallDatasetComponent} from "./components/autocomplete-small-dataset/autocomplete-small-dataset.component";
import {AutocompleteLargeDatasetComponent} from "./components/autocompleteLargeDataset/autocomplete-large-dataset.component";
import {AutocompleteTrie} from './components/autocompleteTrie/autocompleteTrie.component';
import {AutocompleteTrieWebWorkerComponent} from "./components/autocompleteTrieWebWorker/autocomplete-trie-web-worker.component";
import {AutocompleteTrieWebWorkerApiComponent} from './components/autocompleteTrieWebWorkerApi/autocomplete-trie-web-worker-api.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AutoCompleteSmallDatasetComponent,
    AutocompleteLargeDatasetComponent,
    AutocompleteTrie,
    AutocompleteTrieWebWorkerComponent,
    AutocompleteTrieWebWorkerApiComponent,
],
  template: `
    <div class="wrapper">

      <app-autocomplete-small-dataset />
      <app-autocomplete-large-dataset />
      <app-autocomplete-trie />
      <app-autocomplete-trie-web-worker />
      <app-autocomplete-trie-web-worker-api />

    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
