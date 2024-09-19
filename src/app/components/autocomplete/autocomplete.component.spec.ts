import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AutocompleteComponent } from './autocomplete.component';
import { APIService } from '../../services/api.service';
import { provideHttpClient } from '@angular/common/http';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let apiService: jasmine.SpyObj<APIService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('APIService', ['getCities']);

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AutocompleteComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: APIService, useValue: apiServiceSpy }
      ]
    })

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(APIService) as jasmine.SpyObj<APIService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cities on init', () => {
    const dummyCities = 'New York\nLos Angeles\nChicago';
    apiService.getCities.and.returnValue(of(dummyCities));

    component.ngOnInit();

    expect(apiService.getCities).toHaveBeenCalled();
    expect(component.cities).toEqual(['New York', 'Los Angeles', 'Chicago']);
  });

  it('should select a suggestion', () => {
    component.selectSuggestion('New York');

    expect(component.searchControl.value).toBe('New York');
    expect(component.suggestions).toEqual([]);
  });

  it('should initialize with empty search control and no suggestions', () => {
    expect(component.searchControl.value).toBe('');
    expect(component.suggestions.length).toBe(0);
  });
  
});

