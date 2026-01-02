import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, fromEvent, map, Observable, Subject, take } from 'rxjs';

interface WorkerMessageOut {
  requestId: string;
  action: 'initialize' | 'autocomplete' | 'addWord';
  words?: string[];
  prefix?: string;
  word?: string;
}

interface WorkerMessageIn {
  requestId?: string;
  suggestions?: string[];
  status?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private worker: Worker;
  private messageSubject = new Subject<WorkerMessageIn>();

  constructor(private http: HttpClient) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./trie.worker', import.meta.url), {
        type: 'module',
      });

      fromEvent<MessageEvent>(this.worker, 'message')
        .pipe(map((event) => event.data as WorkerMessageIn))
        .subscribe((message) => {
           this.messageSubject.next(message);
        });
    } else {
      throw new Error('Web Workers are not supported in this environment.');
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  initializeTrie(): Observable<string> {
    const requestId = this.generateId();
    
    return new Observable((observer) => {
      this.http
        .get('http://localhost:3000/world-cities.txt', { responseType: 'text' })
        .subscribe({
          next: (data) => {
            const words = data
              .split('\n')
              .map((city) => city.trim())
              .filter((city) => city.length > 0);
              
            this.worker.postMessage({ action: 'initialize', words, requestId } as WorkerMessageOut);
          },
          error: (err) => {
            console.error('Error fetching world cities:', err);
            observer.error(err);
          },
        });

      this.messageSubject
        .pipe(
          filter((msg) => msg.requestId === requestId),
          take(1)
        )
        .subscribe({
          next: (msg) => {
            if (msg.error) observer.error(msg.error);
            else {
                observer.next('Trie initialized successfully.');
                observer.complete();
            }
          },
          error: (err) => observer.error(err),
        });
    });
  }

  getSuggestions(prefix: string): Observable<string[]> {
    const requestId = this.generateId();
    this.worker.postMessage({ action: 'autocomplete', prefix, requestId } as WorkerMessageOut);

    return this.messageSubject.pipe(
      filter((msg) => msg.requestId === requestId), // Only match MY request
      map((msg) => msg.suggestions || []),
      take(1)
    );
  }

  addWord(word: string): Observable<string> {
    const requestId = this.generateId();
    this.worker.postMessage({ action: 'addWord', word, requestId } as WorkerMessageOut);

    return this.messageSubject.pipe(
      filter((msg) => msg.requestId === requestId),
      map((msg) => msg.status || 'unknown'),
      take(1)
    );
  }
}
