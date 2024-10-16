import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('./trie.worker', import.meta.url));
  }

  initializeWords(words: string[]): void {
    this.worker.postMessage({ action: 'initialize', words });
  }

  getSuggestions(prefix: string): Promise<string[]> {
    return new Promise((resolve) => {
      this.worker.onmessage = ({ data }) => {
        resolve(data.suggestions);
      };
      this.worker.postMessage({ action: 'autocomplete', prefix });
    });
  }

  addWord(word: string): void {
    this.worker.postMessage({ action: 'addWord', word });
  }
}
