// The worker script handles the "initialize," "autocomplete," "addWord" and "capitaliseWords" actions 
// by creating a trie data structure and providing autocomplete suggestions based on the prefix provided. 
// the trie data structure is implemented using a class TrieApi and a class TrieNodeApi.

class TrieNodeApi {
  children: { [key: string]: TrieNodeApi } = {};
}

class TrieApi {
  private root: TrieNodeApi;

  constructor() {
    this.root = new TrieNodeApi();
  }

  // Walks the word's characters. If a child node for a character is missing it creates one, then descends
  insert(word: string): void {
    let currentNode = this.root;

    for (const char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNodeApi();
      }
      currentNode = currentNode.children[char];
    }
    
    // Mark the end of a word with a special child key. This allows
    // autoComplete() to recognise complete words when traversing.
    currentNode.children['*'] = new TrieNodeApi(); // End-of-word marker
  }

  // Traverses the same way but stops early if any character path is absent, returning null
  search(prefix: string): TrieNodeApi | null {
    let currentNode = this.root;

    for (const char of prefix) {
      if (!currentNode.children[char]) return null;
      currentNode = currentNode.children[char];
    }
    return currentNode;
  }

   // autoComplete(prefix, limit)
   // Calls search to locate the node representing the prefix.
  // Recursively collects child paths until it has limit matches:
  autoComplete(prefix: string, limit: number = 10): string[] {
    const node = this.search(prefix);
    if (!node) return [];

    const results: string[] = [];
    this.collectAllWords(node, prefix.toLowerCase(), results, limit);
    return results;
  }

  private capitaliseFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Depth-first traversal that appends completed words (capitalised for display) until the limit is reached
  private collectAllWords(node: TrieNodeApi, word: string, results: string[], limit: number): void {
    if (results.length >= limit) return;

    for (const key in node.children) {
      if (key === '*') {
        // better UI experience by capitalising the first letter of the word
        results.push(this.capitaliseFirstLetter(word));
        if (results.length >= limit) break;
      } else {
        this.collectAllWords(node.children[key], word + key, results, limit);
        if (results.length >= limit) break;
      }
    }
  }

}

const trieApi = new TrieApi();

interface TrieWorkerMessage {
  action: 'initialize' | 'autocomplete' | 'addWord';
  words?: string[];
  prefix?: string;
  word?: string;
}

self.onmessage = (event: MessageEvent<TrieWorkerMessage>) => {
  const { action, words, prefix, word } = event.data;

  switch (action) {
    case 'initialize':
      if (Array.isArray(words)) {
        words.forEach((w: string) => trieApi.insert(w));
        postMessage({ status: 'initialised' });
      }
      break;
    case 'autocomplete':
      if (typeof prefix === 'string') {
        const suggestions = trieApi.autoComplete(prefix, 10);
        postMessage({ suggestions });
      }
      break;
    case 'addWord':
      if (typeof word === 'string' && word.trim() !== '') {
        trieApi.insert(word.trim());
        postMessage({ status: 'word_added' });
      }
      break;
    default:
      postMessage({ error: 'Unknown action :(' });
  }
};
