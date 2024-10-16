class TrieNode2 {
  children: { [key: string]: TrieNode2 } = {};
}

class Trie2 {
  private root: TrieNode2;

  constructor() {
    this.root = new TrieNode2();
  }

  insert(word: string): void {
    let currentNode = this.root;

    for (const char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode2();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.children['*'] = true; // End of word marker
  }

  search(prefix: string): TrieNode2 | null {
    let currentNode = this.root;

    for (const char of prefix) {
      if (!currentNode.children[char]) return null;
      currentNode = currentNode.children[char];
    }
    return currentNode;
  }

  autoComplete(prefix: string, limit: number = 10): string[] {
    const node = this.search(prefix);
    if (!node) return [];

    const results: string[] = [];
    this.collectAllWords(node, prefix.toLowerCase(), results, limit);
    return results;
  }

  private collectAllWords(node: TrieNode, word: string, results: string[], limit: number): void {
    if (results.length >= limit) return;

    for (const key in node.children) {
      if (key === '*') {
        results.push(word);
        if (results.length >= limit) break;
      } else {
        this.collectAllWords(node.children[key], word + key, results, limit);
        if (results.length >= limit) break;
      }
    }
  }

}

const trie2 = new Trie2();

self.onmessage = (event) => {
  const { action, words, prefix, word } = event.data;

  switch (action) {
    case 'initialize':
      if (Array.isArray(words)) {
        words.forEach((w: string) => trie2.insert(w));
        postMessage({ status: 'initialized' });
      }
      break;
    case 'autocomplete':
      if (typeof prefix === 'string') {
        const suggestions = trie2.autoComplete(prefix, 10);
        postMessage({ suggestions });
      }
      break;
    case 'addWord':
      if (typeof word === 'string' && word.trim() !== '') {
        trie2.insert(word.trim());
        postMessage({ status: 'word_added' });
      }
      break;
    default:
      postMessage({ error: 'Unknown action' });
  }
};
