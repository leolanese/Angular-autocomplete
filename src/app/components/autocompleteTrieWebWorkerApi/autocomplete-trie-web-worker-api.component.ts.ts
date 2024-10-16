import {CommonModule} from '@angular/common';
import {Component,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subject,debounceTime} from 'rxjs';
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
  
  private inputSubject = new Subject<string>();

  constructor(private trieService: TrieService) {}


  ngOnInit(): void {
    // Initialize the trie with world cities
    this.trieService.initializeTrie().subscribe({
      next: (msg) => console.log(msg),
      error: (err) => console.error('Initialization error:', err),
    });

    // Set up debounce for input
    this.inputSubject.pipe(debounceTime(300)).subscribe((prefix) => {
      this.trieService.getSuggestions(prefix).subscribe({
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
