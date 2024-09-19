import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APIService } from '../../services/api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
  template: `
    <div class="autocomplete-container">
      <input [formControl]="searchControl" placeholder="Search ..." class="autocomplete-input">
      <ul *ngIf="suggestions.length" class="autocomplete-suggestions">
        <li *ngFor="let suggestion of suggestions" (click)="selectSuggestion(suggestion)" class="autocomplete-suggestion">
          {{ suggestion }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .autocomplete-container {
      position: relative;
    }
    .autocomplete-input {
      width: 100%;
      padding: 1em;
      box-sizing: border-box;
    }
    .autocomplete-suggestions {
      list-style-type: none;
      padding: 0;
      margin: 0;
      border: .1em solid #ccc;
      border-top: none;
      max-height: 3em;
      overflow-y: auto;
      background-color: #fff;
    }
    .autocomplete-suggestion {
      padding: 1em;
      cursor: pointer;
    }
    .autocomplete-suggestion:hover {
      background-color: #dede;
    }
  `]
})
export class AutocompleteComponent implements OnInit {
  private apiService = inject(APIService)
  private destroyRef = inject(DestroyRef);
  
  searchControl = new FormControl('');
  suggestions: string[] = [];
  cities: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.apiService.getCities().subscribe((data: string) => {
      this.cities = data.split('\n');
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(searchTerm => {
      const term = searchTerm ?? '';
      this.suggestions = this.cities.filter(city => city.toLowerCase().includes(term.toLowerCase()));
    });
  }

  selectSuggestion(suggestion: string): void {
    this.searchControl.setValue(suggestion);
    this.suggestions = [];
  }
}