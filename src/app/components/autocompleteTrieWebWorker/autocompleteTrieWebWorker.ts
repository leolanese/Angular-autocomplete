// autocomplete.component.ts
import {Component,inject,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SuggestionListComponent} from '../autocompleteTrie/suggestionList.component';
import {TrieService} from './trie.service';

@Component({
  selector: 'autocomplete-trie-web-worker',
  standalone: true,
  imports: [
    FormsModule,
    SuggestionListComponent,
    FormsModule,
    BrowserModule,
  ],
  template: `
    <main>
      <h1>Autocomplete</h1>
      <input
        type="text"
        placeholder="Enter a city (Palmas, Palmares, etc)"
        [(ngModel)]="input"
        (input)="handleInputChange($event)"
        (keyup.enter)="handleAddWord()"
      />

      <!-- Add Button -->
      <button (click)="handleAddWord()">Add Word</button>

      <!-- Suggestions List -->
      <suggestion-list [suggestions]="suggestions"></suggestion-list>
    </main>
  `,
  styleUrls: [],
})
export class AutocompleteTrieWebWorker implements OnInit {
  input: string = '';
  suggestions: string[] = [];
  isLoading: boolean = true;
  private trieService =  inject(TrieService)

  constructor() {}

  ngOnInit(): void {
    this.trieService.loadWorldCities().subscribe({
      next: () => {
        console.log('World cities data sent to Web Worker');
      },
      error: (err) => {
        console.error('Error loading world cities:', err);
        this.isLoading = false;
      },
    });

    this.trieService.citiesLoaded().subscribe({
      next: (loaded: any) => {
        if (loaded) {
          console.log('World cities loaded into Trie');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error in Web Worker:', err);
        this.isLoading = false;
      },
    });
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.input = target.value;
    this.suggestions = this.trieService.autoComplete(this.input);
  }

  handleAddWord(): void {
    if (this.input) {
      this.trieService.insert(this.input.toLowerCase());
      this.input = '';
      this.suggestions = this.trieService.autoComplete('');
    }
  }
}


/*
Key Points:

Web Worker Initialization: The TrieService initializes a Web Worker and listens for messages indicating that the cities have been loaded.
Data Loading: The loadWorldCities method fetches the city data and sends it to the Web Worker for Trie insertion.
Observables: An observable citiesLoaded$ is used to notify components when the data loading is complete.

*/