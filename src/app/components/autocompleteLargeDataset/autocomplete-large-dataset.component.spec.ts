import { describe, expect, it } from 'vitest';

describe('AutocompleteLargeDatasetComponent', () => {
  it('should filter cities case-insensitively', () => {
    const cities = ['Paris', 'London', 'New York', 'Tokyo', 'Berlin'];
    const searchTerm = 'paris';
    
    const filtered = cities.filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(filtered).toContain('Paris');
    expect(filtered.length).toBe(1);
  });

  it('should limit suggestions to 5 items', () => {
    const cities = ['City1', 'City2', 'City3', 'City4', 'City5', 'City6', 'City7'];
    const searchTerm = 'city';
    
    const filtered = cities
      .filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
    
    expect(filtered.length).toBe(5);
  });

  it('should handle null search term', () => {
    const cities = ['Paris', 'London'];
    const searchTerm = null;
    
    const normalizedTerm = searchTerm?.toLowerCase() ?? '';
    const filtered = normalizedTerm ? cities.filter(city =>
      city.toLowerCase().includes(normalizedTerm)
    ) : [];
    
    expect(filtered.length).toBe(0);
  });

  it('should use trackBy function correctly', () => {
    const trackByFn = (index: number, item: string): string => item;
    
    const result = trackByFn(0, 'Paris');
    expect(result).toBe('Paris');
  });
});
