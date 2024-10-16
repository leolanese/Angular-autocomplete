import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

class TrieNode {
  children: { [key: string]: TrieNode } = {};
}

@Injectable({
  providedIn: 'root',
})
export class TrieService {
  private root: TrieNode;
  
  constructor(private http: HttpClient) {
    this.root = new TrieNode();
  }

  // Fetch the world cities and insert them into the Trie
  loadWorldCities(): Observable<void> {
    return this.http.get('http://localhost:3000/world-cities.txt', { responseType: 'text' }).pipe(
      map((data: string) => {
        const cities = data.split('\n').map(city => city.trim());
        cities.forEach(city => this.insert(city));
      })
    );
  }

  insert(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.children['*'] = new TrieNode(); // Mark the end of a word
  }

  search(word: string): TrieNode | null {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children[char]) {
        return null;
      }
      currentNode = currentNode.children[char];
    }
    return currentNode;
  }

  collectAllWords(node: TrieNode = this.root, word: string = '', words: string[] = []): string[] {
    for (const key in node.children) {
      if (key === '*') {
        words.push(word);
      } else {
        this.collectAllWords(node.children[key], word + key, words);
      }
    }
    return words;
  }

  autoComplete(prefix: string): string[] {
    const currentNode = this.search(prefix);
    if (!currentNode) {
      return [];
    }
    return this.collectAllWords(currentNode, prefix);
  }
}