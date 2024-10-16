import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable,Subject} from 'rxjs';
import {map} from 'rxjs/operators';

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private root: TrieNode = new TrieNode();
  private worker: Worker|undefined;
  private citiesLoaded$ = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.root = new TrieNode();
  }

    // Load world cities and send to Web Worker
  loadWorldCities(): Observable<boolean> {
    return this.http.get('http://localhost:3000/world-cities.txt', { responseType: 'text' }).pipe(
      map((data: string) => {
        const cities = data.split('\n').map(city => city.trim()).filter(city => city);
        if (this.worker) {
          this.worker.postMessage({ type: 'LOAD_CITIES', payload: cities });
        }
        return true;
      })
    );
  }

  // Expose an observable to know when cities are loaded
  citiesLoaded(): Observable<boolean> {
    return this.citiesLoaded$.asObservable();
  }

  insert(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.isEndOfWord = true;
  }

  search(prefix: string): TrieNode | null {
    let currentNode = this.root;
    for (const char of prefix) {
      if (!currentNode.children.has(char)) {
        return null;
      }
      currentNode = currentNode.children.get(char)!;
    }
    return currentNode;
  }

  autoComplete(prefix: string, limit: number = 10): string[] {
    const suggestions: string[] = [];
    const node = this.search(prefix.toLowerCase());
    if (!node) {
      return suggestions;
    }

    const stack: { node: TrieNode; word: string }[] = [{ node, word: prefix }];

    while (stack.length && suggestions.length < limit) {
      const { node: currentNode, word } = stack.pop()!;
      if (currentNode.isEndOfWord) {
        suggestions.push(word);
      }

      for (const [char, childNode] of currentNode.children) {
        stack.push({ node: childNode, word: word + char });
        if (suggestions.length >= limit) break;
      }
    }

    return suggestions;
  }
}