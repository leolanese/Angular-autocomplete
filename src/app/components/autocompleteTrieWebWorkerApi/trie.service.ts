import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter,fromEvent,map,Observable,Subject,take} from 'rxjs';

interface WorkerMessage {
  suggestions?: string[];
  status?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private worker: Worker;
  private messageSubject = new Subject<WorkerMessage>();

  constructor(private http: HttpClient) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./trie.worker', import.meta.url), {
        type: 'module',
      });

      fromEvent<MessageEvent>(this.worker, 'message')
        .pipe(
          map((event) => event.data as WorkerMessage)
        )
        .subscribe((message) => {
          this.messageSubject.next(message);
        });

    } else {
      throw new Error('Web Workers are not supported in this environment.');
    }
  }

  initializeTrie(): Observable<string> {
    return new Observable((observer) => {
      this.http
        .get('http://localhost:3000/world-cities.txt', { responseType: 'text' })
        .subscribe({
          next: (data) => {
            const words = data
              .split('\n')
              .map((city) => city.trim())
              .filter((city) => city.length > 0);
            this.worker.postMessage({ action: 'initialize', words });
          },
          error: (err) => {
            console.error('Error fetching world cities:', err);
            observer.error(err);
          },
        });

      this.messageSubject
        .pipe(
          filter((msg) => msg.status === 'initialized'),
          take(1)
        )
        .subscribe({
          next: () => {
            observer.next('Trie initialized successfully.');
            observer.complete();
          },
          error: (err: any) => observer.error(err),
        });
    });
  }

  getSuggestions(prefix: string): Observable<string[]> {
    this.worker.postMessage({ action: 'autocomplete', prefix });

    return this.messageSubject.pipe(
      filter((msg) => !!msg.suggestions),
      map((msg) => msg.suggestions as string[]),
      take(1)
    );
  }

  addWord(word: string): Observable<string> {
    this.worker.postMessage({ action: 'addWord', word });

    return this.messageSubject.pipe(
      filter((msg) => msg.status === 'word_added'),
      map((msg) => msg.status as string),
      take(1)
    );
  }

}
