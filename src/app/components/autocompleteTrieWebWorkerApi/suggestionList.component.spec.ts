import { describe, expect, it } from 'vitest';
import { SuggestionListComponent } from './suggestionList.component';

describe('SuggestionListComponent', () => {
  it('should create', () => {
    const component = new SuggestionListComponent();
    expect(component).toBeTruthy();
  });

  it('should initialize with empty suggestions array', () => {
    const component = new SuggestionListComponent();
    expect(component.suggestions).toEqual([]);
  });

  it('should accept suggestions input', () => {
    const component = new SuggestionListComponent();
    const testSuggestions = ['Paris', 'London', 'Berlin'];
    component.suggestions = testSuggestions;
    
    expect(component.suggestions).toEqual(testSuggestions);
    expect(component.suggestions.length).toBe(3);
  });

  it('should update suggestions', () => {
    const component = new SuggestionListComponent();
    
    component.suggestions = ['Paris'];
    expect(component.suggestions.length).toBe(1);
    
    component.suggestions = ['Paris', 'London'];
    expect(component.suggestions.length).toBe(2);
  });
});
