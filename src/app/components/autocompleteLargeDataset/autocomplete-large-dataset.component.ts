import {CommonModule} from '@angular/common';
import {Component,DestroyRef,inject,OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl,FormsModule,ReactiveFormsModule} from '@angular/forms';
import {debounceTime,distinctUntilChanged,map,switchMap} from 'rxjs';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-autocomplete-large-dataset',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
  template: `
    <div class="autocomplete-container">
      <h2>large dataset</h2>
      <input [formControl]="searchControl" placeholder="Search ..." class="autocomplete-input">
 
      <ul *ngIf="suggestions.length" class="autocomplete-suggestions">
        <li *ngFor="let suggestion of suggestions; trackBy: trackByFn" (click)="selectSuggestion(suggestion)" class="autocomplete-suggestion">
          {{ suggestion }}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['autocomplete-large-dataset.component.scss']
})
export class AutocompleteLargeDatasetComponent implements OnInit {
  private apiService = inject(APIService)
  private destroyRef = inject(DestroyRef);
  
  searchControl = new FormControl('');
  suggestions: string[] = [];
  cities: string[] = [];

  constructor() {}

  ngOnInit(): void {
  // Fetch cities and process them
  const cities$ = this.apiService.getCities().pipe(
    map((data: string) => data.split('\n')),
    takeUntilDestroyed(this.destroyRef) // Automatically cleans up when the component is destroyed
  );

  // Combine the cities data with search control value changes
  cities$.pipe(
    switchMap(cities =>
      this.searchControl.valueChanges.pipe(
        
        debounceTime(300), // Delay the processing for better UX
        distinctUntilChanged(), // Only proceed if the search term changes

        map(searchTerm => searchTerm?.toLowerCase() ?? ''),
        map(term => cities
          .filter(city => city.toLowerCase().includes(term)) // Filter suggestions
          .slice(0, 5) // limit the number of suggestions for better UX
        ) 
      )
    ),
    takeUntilDestroyed(this.destroyRef) // Automatically cleans up when the component is destroyed
  ).subscribe(filteredCities => {
    this.suggestions = filteredCities;
  });
  }

  selectSuggestion(suggestion: string): void {
    this.searchControl.setValue(suggestion);
    this.suggestions = [];
  }

  trackByFn(index: number, item: string): string {
    return item;
  }

}