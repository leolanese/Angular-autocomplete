import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { APIService } from './api.service';

describe('APIService', () => {
  it('should be created', () => {
    const mockHttp = {
      get: vi.fn(() => of('Paris\nLondon'))
    } as any;
    
    const service = new APIService(mockHttp);
    expect(service).toBeTruthy();
  });

  it('should fetch cities as an observable', async () => {
    const dummyCities = 'New York\nLos Angeles\nChicago';
    const mockHttp = {
      get: vi.fn(() => of(dummyCities))
    } as any;
    
    const service = new APIService(mockHttp);
    
    const cities = await new Promise<string>((resolve) => {
      service.getCities().subscribe(cities => {
        resolve(cities);
      });
    });
    
    expect(cities).toBe(dummyCities);
    expect(mockHttp.get).toHaveBeenCalledWith(
      'http://localhost:3000/world-cities.txt',
      { responseType: 'text' }
    );
  });

  it('should call http.get with correct URL and options', () => {
    const mockHttp = {
      get: vi.fn(() => of('test'))
    } as any;
    
    const service = new APIService(mockHttp);
    service.getCities();
    
    expect(mockHttp.get).toHaveBeenCalledWith(
      'http://localhost:3000/world-cities.txt',
      { responseType: 'text' }
    );
  });
});