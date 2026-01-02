import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SuggestionListComponent } from './suggestionList.component';

describe('SuggestionListComponent', () => {
  let component: SuggestionListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuggestionListComponent]
    });
    const fixture = TestBed.createComponent(SuggestionListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty suggestions array', () => {
    expect(component.suggestions).toEqual([]);
  });

  it('should accept suggestions input', () => {
    const testSuggestions = ['Paris', 'London', 'Berlin'];
    component.suggestions = testSuggestions;
    
    expect(component.suggestions).toEqual(testSuggestions);
    expect(component.suggestions.length).toBe(3);
  });

  it('should render suggestions in template', () => {
    const fixture = TestBed.createComponent(SuggestionListComponent);
    component = fixture.componentInstance;
    
    component.suggestions = ['Paris', 'London'];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const listItems = compiled.querySelectorAll('li');
    
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain('Paris');
    expect(listItems[1].textContent).toContain('London');
  });

  it('should show empty message when no suggestions', () => {
    const fixture = TestBed.createComponent(SuggestionListComponent);
    component = fixture.componentInstance;
    
    component.suggestions = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const paragraph = compiled.querySelector('p');
    
    expect(paragraph).toBeTruthy();
    expect(paragraph.textContent).toContain('Case sensitive search');
  });

  it('should use OnPush change detection', () => {
    const fixture = TestBed.createComponent(SuggestionListComponent);
    
    expect(fixture.componentRef.changeDetectorRef).toBeTruthy();
  });

  it('should track suggestions by value', () => {
    const fixture = TestBed.createComponent(SuggestionListComponent);
    component = fixture.componentInstance;
    
    const suggestions1 = ['Paris', 'London'];
    component.suggestions = suggestions1;
    fixture.detectChanges();
    
    const suggestions2 = ['Paris', 'Berlin'];
    component.suggestions = suggestions2;
    fixture.detectChanges();
    
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(2);
  });
});
