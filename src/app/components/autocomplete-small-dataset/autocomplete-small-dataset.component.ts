import {Component} from '@angular/core';
import {FormControl,ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

import {CommonModule} from '@angular/common';

interface Item {
  title: string;
  image: string;
}

@Component({
    selector: 'app-autocomplete-small-dataset',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <h2>small dataset</h2> 
    <div class="position-relative">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Search..." 
        [formControl]="searchControl" 
        aria-haspopup="true" 
        />
      <div *ngIf="filteredItems.length > 0" class="dropdown-menu show position-absolute w-100" style="z-index: 1">
        <button 
          *ngFor="let item of filteredItems" 
          type="button" 
          class="dropdown-item d-flex align-items-center"
          (click)="selectItem(item)">
          
          <img 
            [src]="item.image" 
            alt="{{ item.title }}" 
            class="me-2" width="24" height="24" />
            
          {{ item.title }}
        </button>
      </div>
  </div>
  `,
    styles: `
   .dropdown-item img {
     width: 24px;
     height: 24px;
   }
  `
})

export class AutoCompleteSmallDatasetComponent {
  searchControl = new FormControl();
  items: Item[] = [
    { title: 'A', image: 'assets/images/a.jpg' },
    { title: 'AA', image: 'assets/images/aa.jpg' },
    { title: 'AAA', image: 'assets/images/aaa.jpg' },
    // Add more items here
  ];
  filteredItems: Item[] = [];

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.filteredItems = this._filter(value || '');
    });
  }

  private _filter(value: string): Item[] {
    if (!value.trim()) return [];

    const filterValue = value.toLowerCase();
    return this.items.filter((item) =>
      item.title.toLowerCase().includes(filterValue)
    );
  }

  selectItem(item: Item) {
    this.searchControl.setValue(item.title);
    this.filteredItems = [];
  }
}