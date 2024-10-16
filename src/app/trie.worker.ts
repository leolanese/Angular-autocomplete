/// <reference lib="webworker" />
import {TrieService} from './app/components/autocompleteTrieWebWorker/trie.service';

let trieService = new TrieService(null as any); // HttpClient is not available in Web Workers

addEventListener('message', ({ data }) => {
  if (data.type === 'LOAD_CITIES') {
    const cities: string[] = data.payload;
    cities.forEach(city => trieService.insert(city.toLowerCase()));
    postMessage({ type: 'CITIES_LOADED' });
  }
});
