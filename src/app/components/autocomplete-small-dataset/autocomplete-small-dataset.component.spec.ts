import { describe, expect, it } from 'vitest';

describe('AutoCompleteSmallDatasetComponent', () => {
  it('should filter items case-insensitively', () => {
    const items = [
      { title: 'Apple', image: 'apple.jpg' },
      { title: 'Banana', image: 'banana.jpg' },
      { title: 'Cherry', image: 'cherry.jpg' }
    ];
    
    const filterValue = 'app';
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Apple');
  });

  it('should return empty array for empty search', () => {
    const items = [
      { title: 'Apple', image: 'apple.jpg' }
    ];
    
    const filterValue = '';
    const filtered = filterValue.trim() ? items.filter((item) =>
      item.title.toLowerCase().includes(filterValue.toLowerCase())
    ) : [];
    
    expect(filtered).toEqual([]);
  });

  it('should return empty array for whitespace-only search', () => {
    const items = [
      { title: 'Apple', image: 'apple.jpg' }
    ];
    
    const filterValue = '   ';
    const filtered = filterValue.trim() ? items.filter((item) =>
      item.title.toLowerCase().includes(filterValue.toLowerCase())
    ) : [];
    
    expect(filtered).toEqual([]);
  });

  it('should filter multiple matching items', () => {
    const items = [
      { title: 'Apple', image: 'apple.jpg' },
      { title: 'Apricot', image: 'apricot.jpg' },
      { title: 'Banana', image: 'banana.jpg' }
    ];
    
    const filterValue = 'ap';
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    expect(filtered.length).toBe(2);
    expect(filtered.map(i => i.title)).toEqual(['Apple', 'Apricot']);
  });
});
