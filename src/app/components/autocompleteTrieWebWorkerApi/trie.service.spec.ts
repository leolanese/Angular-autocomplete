import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { TrieService } from './trie.service';

// Mock Worker globally
class MockWorker {
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  terminate() {}
}
globalThis.Worker = MockWorker as any;

describe('TrieService Smoke Test', () => {
  it('should be created locally (manual mock)', () => {
    // Mock HttpClient
    const mockHttp = {
      get: vi.fn(() => of('Paris\nLondon'))
    } as any;

    // Manually instance the service
    const service = new TrieService(mockHttp);
    
    expect(service).toBeTruthy();
  });
});
