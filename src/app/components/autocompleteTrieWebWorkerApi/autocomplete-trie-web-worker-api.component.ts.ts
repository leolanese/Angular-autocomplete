import {CommonModule} from '@angular/common';
import {Component,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TrieService} from './trie.service';

@Component({
  selector: 'app-autocomplete-trie-web-worker-api',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './autocomplete-trie-web-worker-api.component.html',
})
export class AutocompleteTrieWebWorkerApiComponent implements OnInit {
  suggestions: string[] = [];
  input: string = '';

  constructor(private trieService: TrieService) {}

  ngOnInit(): void {
    // Initialize the trie with words from the HTTP request
    this.trieService.initializeWords().subscribe({
      next: () => this.updateSuggestions(),
      error: (err) => console.error('Error initializing words:', err),
    });
  }

  handleInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.input = inputElement.value;
    this.updateSuggestions();
  }

  updateSuggestions(): void {
    this.trieService.getSuggestions(this.input).then((suggestions) => {
      this.suggestions = suggestions;
    });
  }

  handleAddWord(): void {
    if (this.input) {
      this.trieService.addWord(this.input);
      this.input = '';
      this.updateSuggestions();
    }
  }
}
