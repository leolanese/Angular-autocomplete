import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APIService } from './api.service';

describe('APIService', () => {
  let service: APIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [APIService]
    });

    service = TestBed.inject(APIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cities as an observable', () => {
    const dummyCities = 'New York\nLos Angeles\nChicago';

    service.getCities().subscribe(cities => {
      expect(cities).toBe(dummyCities);
    });

    const req = httpMock.expectOne(service['citiesUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCities);
  });
});