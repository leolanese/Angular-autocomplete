import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private worker: Worker;

  constructor(private http: HttpClient) {
    this.worker = new Worker(new URL('./trie.worker', import.meta.url));
  }

  initializeWords(): Observable<void> {
    return new Observable((observer) => {
      this.http.get('http://localhost:3000/world-cities.txt', { responseType: 'text' })
        .subscribe({
          next: (data) => {
            const words = data.split('\n').map(city => city.trim()).filter(city => city.length > 0);
            this.worker.postMessage({ action: 'initialize', words });
            observer.next();
            observer.complete();
          },
          error: (err) => {
            console.error('Error fetching world cities:', err);
            observer.error(err);
          }
        });
    });
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
