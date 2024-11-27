import {Component,inject,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SuggestionListComponent} from './suggestionList.component';
import {TrieService} from './trie.service';

@Component({
  selector: 'app-autocomplete-trie',
  standalone: true,
  imports: [
    FormsModule,
    SuggestionListComponent,
    FormsModule
  ],
  template: `
    <main>
      <h2>Trie Data Structure</h2>
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
})
export class AutocompleteTrie implements OnInit  {
  input: string = '';
  suggestions: string[] = [];
  private trieService = inject(TrieService)

  constructor() { }

    ngOnInit(): void {
    // Load the world cities into the Trie
    this.trieService.loadWorldCities().subscribe({
      next: () => {
        console.log('World cities loaded successfully');
      },
      error: (err) => {
        console.error('Error loading world cities:', err);
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
      this.trieService.insert(this.input);
      this.input = '';
      this.suggestions = this.trieService.autoComplete('');
    }
  }
}