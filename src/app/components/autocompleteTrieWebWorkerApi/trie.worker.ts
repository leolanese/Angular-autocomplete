// The worker script handles the "initialize," "autocomplete," "addWord" messages
// It uses a Trie data structure that stores the ORIGINAL word at the leaf node,
// but traverses using lowercase keys to ensure case-insensitive search.

class TrieNodeApi {
  children: { [key: string]: TrieNodeApi } = {};
  originalWord?: string; // Stores the exact casing of the word at the end of the path
}

class TrieApi {
  private root: TrieNodeApi;

  constructor() {
    this.root = new TrieNodeApi();
  }

  insert(word: string): void {
    if (!word) return;
    let currentNode = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNodeApi();
      }
      currentNode = currentNode.children[char];
    }
    
    // store the original word to return it later with correct casing
    currentNode.originalWord = word;
  }

  search(prefix: string): TrieNodeApi | null {
    let currentNode = this.root;
    const lowerPrefix = prefix.toLowerCase();

    for (const char of lowerPrefix) {
      if (!currentNode.children[char]) return null;
      currentNode = currentNode.children[char];
    }
    return currentNode;
  }

  autoComplete(prefix: string, limit: number = 10): string[] {
    const node = this.search(prefix);
    if (!node) return [];

    const results: string[] = [];
    this.collectWords(node, results, limit);
    return results;
  }

  private collectWords(node: TrieNodeApi, results: string[], limit: number): void {
    if (results.length >= limit) return;

    if (node.originalWord) {
      results.push(node.originalWord);
    }

    // Traverse children
    for (const key in node.children) {
      this.collectWords(node.children[key], results, limit);
      if (results.length >= limit) return;
    }
  }
}

const trieApi = new TrieApi();

export interface TrieWorkerMessage {
  requestId?: string; // UUID to correlate request/response
  action: 'initialize' | 'autocomplete' | 'addWord';
  words?: string[];
  prefix?: string;
  word?: string;
}

export interface TrieWorkerResponse {
  requestId?: string;
  status?: string;
  suggestions?: string[];
  error?: string;
}

self.onmessage = (event: MessageEvent<TrieWorkerMessage>) => {
  const { action, words, prefix, word, requestId } = event.data;

  try {
    switch (action) {
      case 'initialize':
        if (Array.isArray(words)) {
          words.forEach((w: string) => trieApi.insert(w));
          postMessage({ requestId, status: 'initialized' });
        }
        break;

      case 'autocomplete':
        if (typeof prefix === 'string') {
          const suggestions = trieApi.autoComplete(prefix, 10);
          postMessage({ requestId, suggestions });
        } else {
            postMessage({ requestId, suggestions: [] });
        }
        break;

      case 'addWord':
        if (typeof word === 'string' && word.trim() !== '') {
          trieApi.insert(word.trim());
          postMessage({ requestId, status: 'word_added' });
        }
        break;

      default:
        postMessage({ requestId, error: 'Unknown action' });
    }
  } catch (e: any) {
    postMessage({ requestId, error: e.toString() });
  }
};
