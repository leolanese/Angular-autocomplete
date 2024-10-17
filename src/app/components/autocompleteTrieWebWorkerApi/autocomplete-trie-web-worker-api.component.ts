import {CommonModule} from '@angular/common';
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subject,debounceTime} from 'rxjs';
import {SuggestionListComponent} from "./suggestionList.component";
import {TrieService} from './trie.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-autocomplete-trie-web-worker-api',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SuggestionListComponent
],
  template: `
    <main>
      <h1>Autocomplete Angular: Using Trie + WW + API</h1>

      <input type="text"
        placeholder="Enter city (Andorra, etc)"
        [(ngModel)]="input"
        (input)="onInputChange($event)"
        (keyup.enter)="handleAddWord()"
      />

      <button (click)="handleAddWord()">Add Word</button>

      <!-- Suggestions List -->
      <suggestion-list [suggestions]="suggestions" />

    </main>
    `,
})
export class AutocompleteTrieWebWorkerApiComponent implements OnInit {
  suggestions: string[] = [];
  input: string = '';

  private inputSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef)

  constructor(private trieService: TrieService) {}

  ngOnInit(): void {
    // Initialise the trie with world cities
    this.trieService.initializeTrie().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (msg) => console.log(msg),
      error: (err) => console.error('Initialisation error:', err),
    });

    // Set up debounce for input
    this.inputSubject.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((prefix) => {
      this.trieService.getSuggestions(prefix).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (suggestions) => (this.suggestions = suggestions),
        error: (err) => console.error('Error fetching suggestions:', err),
      });
    });
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.input = inputElement.value;
    this.inputSubject.next(this.input);
  }

  handleAddWord(): void {
    if (this.input.trim() === '') return;

    this.trieService.addWord(this.input.trim()).subscribe({
      next: (status) => {
        console.log(status);
        this.input = '';
        this.suggestions = [];
      },
      error: (err) => console.error('Error adding word:', err),
    });
  }
}
