import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
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
  private trieService = inject(TrieService);

  // Writable signal for input
  input = signal<string>('');

  // Derived signal for suggestions using RxJS for async handling
  // This automatically cancels previous requests via switchMap
  suggestions = toSignal(
    toObservable(this.input).pipe(
      debounceTime(300),
      switchMap(prefix => {
        if (!prefix || !prefix.trim()) return of([]);
        return this.trieService.getSuggestions(prefix);
      })
    ), 
    { initialValue: [] }
  );

  constructor() {
    this.trieService.initializeTrie().subscribe();
  }

  handleAddWord(): void {
    const value = this.input().trim();
    if (!value) return;

    this.trieService.addWord(value).subscribe({
      next: () => {
        this.input.set('');
        // Suggestions will automatically update to empty via the pipeline
      },
      error: (err) => console.error('Error adding word:', err)
    });
  }
}
