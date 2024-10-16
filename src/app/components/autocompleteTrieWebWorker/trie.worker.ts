class TrieNode {
  children: { [key: string]: TrieNode } = {};
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let currentNode = this.root;

    for (const char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.isEndOfWord = true; // End of word marker
  }

  search(prefix: string): TrieNode | null {
    let currentNode = this.root;

    for (const char of prefix) {
      if (!currentNode.children[char]) return null;
      currentNode = currentNode.children[char];
    }
    return currentNode;
  }

  autoComplete(prefix: string): string[] {
    const node = this.search(prefix);
    return this.collectAllWords(node, prefix);
  }

  private collectAllWords(node: TrieNode | null, word: string): string[] {
    if (!node) return [];
    const words: string[] = [];

    for (const key in node.children) {
      const child = node.children[key];
      if (key === '*') {
        words.push(word);
      } else {
        words.push(...this.collectAllWords(child, word + key));
      }
    }

    return words;
  }
}

const trieInstance = new Trie();

onmessage = (event) => {
  const { action, words, prefix, word } = event.data;

  switch (action) {
    case 'initialize':
      words.forEach((w: string) => trieInstance.insert(w));
      break;
    case 'autocomplete':
      const suggestions = trieInstance.autoComplete(prefix);
      postMessage({ suggestions });
      break;
    case 'addWord':
      if (word) {
        trieInstance.insert(word);
      }
      break;
  }
};
