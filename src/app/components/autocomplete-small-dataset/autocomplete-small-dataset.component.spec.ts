import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AutoCompleteSmallDatasetComponent } from './autocomplete-small-dataset.component';

describe('AutoCompleteSmallDatasetComponent', () => {
  let component: AutoCompleteSmallDatasetComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutoCompleteSmallDatasetComponent]
    });
    const fixture = TestBed.createComponent(AutoCompleteSmallDatasetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty filteredItems', () => {
    expect(component.filteredItems).toEqual([]);
  });

  it('should have predefined items', () => {
    expect(component.items.length).toBeGreaterThan(0);
    expect(component.items[0]).toHaveProperty('title');
    expect(component.items[0]).toHaveProperty('image');
  });

  it('should filter items based on search input', () => {
    component.ngOnInit();
    
    component.searchControl.setValue('A');
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(300);
    
    expect(component.filteredItems.length).toBeGreaterThan(0);
    expect(component.filteredItems.every(item => 
      item.title.toLowerCase().includes('a')
    )).toBe(true);
    
    vi.useRealTimers();
  });

  it('should return empty array for empty search', () => {
    component.ngOnInit();
    
    component.searchControl.setValue('');
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(300);
    
    expect(component.filteredItems).toEqual([]);
    
    vi.useRealTimers();
  });

  it('should return empty array for whitespace-only search', () => {
    component.ngOnInit();
    
    component.searchControl.setValue('   ');
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(300);
    
    expect(component.filteredItems).toEqual([]);
    
    vi.useRealTimers();
  });

  it('should perform case-insensitive filtering', () => {
    component.ngOnInit();
    
    component.searchControl.setValue('a');
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(300);
    
    const lowerCaseResults = component.filteredItems;
    
    component.searchControl.setValue('A');
    vi.advanceTimersByTime(300);
    
    const upperCaseResults = component.filteredItems;
    
    expect(lowerCaseResults).toEqual(upperCaseResults);
    
    vi.useRealTimers();
  });

  it('should select item and clear filtered items', () => {
    const testItem = { title: 'Test', image: 'test.jpg' };
    component.filteredItems = [testItem];
    
    component.selectItem(testItem);
    
    expect(component.searchControl.value).toBe('Test');
    expect(component.filteredItems).toEqual([]);
  });

  it('should debounce search input', () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('A');
    expect(component.filteredItems).toEqual([]);
    
    vi.advanceTimersByTime(100);
    expect(component.filteredItems).toEqual([]);
    
    vi.advanceTimersByTime(200);
    expect(component.filteredItems.length).toBeGreaterThan(0);
    
    vi.useRealTimers();
  });
});
