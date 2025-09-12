import {Component} from '@angular/core';

import {AutoCompleteSmallDatasetComponent} from "./components/autocomplete-small-dataset/autocomplete-small-dataset.component";
import {AutocompleteLargeDatasetComponent} from "./components/autocompleteLargeDataset/autocomplete-large-dataset.component";
import {AutocompleteTrieWebWorkerApiComponent} from "./components/autocompleteTrieWebWorkerApi/autocomplete-trie-web-worker-api.component";
import {AutocompleteTrieWebWorkerApiSignalComponent} from "./components/autocompleteTrieWebWorkerApiSignal/autocomplete-trie-web-worker-api-signal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AutoCompleteSmallDatasetComponent,
    AutocompleteLargeDatasetComponent,
    AutocompleteTrieWebWorkerApiComponent,
    AutocompleteTrieWebWorkerApiSignalComponent,
],
  template: `
    <div class="wrapper">

      <app-autocomplete-small-dataset />
      <app-autocomplete-large-dataset />

      <hr />

      <app-autocomplete-trie-web-worker-api />
      <app-autocomplete-trie-web-worker-api-signal />

      <hr />

    </div>
  `
})
export class AppComponent {
  title = 'autocomplete-test';
}
