import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APIService } from '../../services/api.service';
import { AutocompleteLargeDatasetComponent } from './autocomplete-large-dataset.component';

describe('AutocompleteLargeDatasetComponent', () => {
  let component: AutocompleteLargeDatasetComponent;
  let mockApiService: { getCities: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockApiService = {
      getCities: vi.fn(() => of('Paris\nLondon\nNew York\nTokyo\nBerlin\nMadrid\nRome'))
    };

    TestBed.configureTestingModule({
      imports: [AutocompleteLargeDatasetComponent],
      providers: [
        { provide: APIService, useValue: mockApiService }
      ]
    });

    const fixture = TestBed.createComponent(AutocompleteLargeDatasetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty suggestions', () => {
    expect(component.suggestions).toEqual([]);
  });

  it('should fetch cities on init', () => {
    component.ngOnInit();
    expect(mockApiService.getCities).toHaveBeenCalled();
  });

  it('should filter cities based on search input', async () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('paris');
    vi.advanceTimersByTime(300);
    
    await vi.waitFor(() => {
      expect(component.suggestions).toContain('Paris');
    });
    
    vi.useRealTimers();
  });

  it('should perform case-insensitive search', async () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('LONDON');
    vi.advanceTimersByTime(300);
    
    await vi.waitFor(() => {
      expect(component.suggestions).toContain('London');
    });
    
    vi.useRealTimers();
  });

  it('should limit suggestions to 5 items', async () => {
    mockApiService.getCities.mockReturnValue(
      of('City1\nCity2\nCity3\nCity4\nCity5\nCity6\nCity7\nCity8')
    );
    
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('city');
    vi.advanceTimersByTime(300);
    
    await vi.waitFor(() => {
      expect(component.suggestions.length).toBeLessThanOrEqual(5);
    });
    
    vi.useRealTimers();
  });

  it('should debounce search input', () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('par');
    expect(component.suggestions).toEqual([]);
    
    vi.advanceTimersByTime(100);
    expect(component.suggestions).toEqual([]);
    
    vi.advanceTimersByTime(200);
    
    vi.useRealTimers();
  });

  it('should handle distinctUntilChanged - not trigger for same value', () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('paris');
    vi.advanceTimersByTime(300);
    
    const callCount = mockApiService.getCities.mock.calls.length;
    
    component.searchControl.setValue('paris');
    vi.advanceTimersByTime(300);
    
    expect(mockApiService.getCities.mock.calls.length).toBe(callCount);
    
    vi.useRealTimers();
  });

  it('should select suggestion and clear suggestions list', () => {
    component.suggestions = ['Paris', 'London'];
    
    component.selectSuggestion('Paris');
    
    expect(component.searchControl.value).toBe('Paris');
    expect(component.suggestions).toEqual([]);
  });

  it('should use trackByFn correctly', () => {
    const result = component.trackByFn(0, 'Paris');
    expect(result).toBe('Paris');
  });

  it('should handle empty search term', async () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue('');
    vi.advanceTimersByTime(300);
    
    await vi.waitFor(() => {
      expect(component.suggestions.length).toBe(0);
    });
    
    vi.useRealTimers();
  });

  it('should handle null search term', async () => {
    component.ngOnInit();
    
    vi.useFakeTimers();
    
    component.searchControl.setValue(null);
    vi.advanceTimersByTime(300);
    
    await vi.waitFor(() => {
      expect(component.suggestions.length).toBe(0);
    });
    
    vi.useRealTimers();
  });

  it('should cleanup subscriptions on destroy', () => {
    component.ngOnInit();
    
    const fixture = TestBed.createComponent(AutocompleteLargeDatasetComponent);
    fixture.destroy();
    
    expect(() => fixture.destroy()).not.toThrow();
  });
});
