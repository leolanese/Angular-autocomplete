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

  autoComplete(prefix: string): string[] {
    const node = this.search(prefix);
    return this.collectAllWords(node, prefix);
  }

  private collectAllWords(node: TrieNode2 | null, word: string): string[] {
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

const trie2 = new Trie2();

onmessage = (event) => {
  const { action, words, prefix, word } = event.data;

  switch (action) {
    case 'initialize':
      words.forEach((w: string) => trie2.insert(w));
      break;
    case 'autocomplete':
      const suggestions = trie2.autoComplete(prefix);
      postMessage({ suggestions });
      break;
    case 'addWord':
      if (word) {
        trie2.insert(word);
      }
      break;
  }
};
