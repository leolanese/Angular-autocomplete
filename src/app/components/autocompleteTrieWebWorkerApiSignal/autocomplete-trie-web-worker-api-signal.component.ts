import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuggestionListComponent } from "../autocompleteTrieWebWorkerApi/suggestionList.component";
import { TrieService } from "../autocompleteTrieWebWorkerApi/trie.service";

@Component({
    selector: 'app-autocomplete-trie-web-worker-api-signal',
    imports: [
        CommonModule,
        FormsModule,
        SuggestionListComponent
    ],
    template: `
    <main>
      <h2>Trie Data Structure + WebWorker + API (Signals)</h2>

      <input type="text"
        placeholder="Enter city (Andorra, etc)"
        [value]="input()"
        (input)="input.set($any($event.target).value)"
        (keyup.enter)="handleAddWord()" />

      <button (click)="handleAddWord()">Add Word</button>

      <!-- Suggestions List -->
      <suggestion-list [suggestions]="suggestions()" />
    </main>
  `
})
export class AutocompleteTrieWebWorkerApiSignalComponent {
  private destroyRef = inject(DestroyRef);
  private trieService = inject(TrieService);

  // Writable signals for template state
  input = signal<string>('');
  suggestions = signal<string[]>([]);

  constructor() {
    // Initialise trie on component creation
    this.trieService.initializeTrie().pipe().subscribe();

    // Whenever input changes, fetch suggestions
    effect(() => {
      const prefix = this.input();
      if (!prefix) {
        this.suggestions.set([]);
        return;
      }
      // Fire request and dispose automatically when destroyed
      this.trieService.getSuggestions(prefix).pipe().subscribe({
        next: (s) => this.suggestions.set(s),
        error: (err) => console.error('Error fetching suggestions:', err)
      });
    }, { allowSignalWrites: true, manualCleanup: true });
  }

  handleAddWord(): void {
    const value = this.input().trim();
    if (!value) return;

    this.trieService.addWord(value).subscribe({
      next: () => {
        this.input.set('');
        this.suggestions.set([]);
      },
      error: (err) => console.error('Error adding word:', err)
    });
  }
}
