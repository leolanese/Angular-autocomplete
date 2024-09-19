import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private citiesUrl = 'http://localhost:3000/world-cities.txt';

  constructor(private http: HttpClient) {}

  getCities(): Observable<string> {
    return this.http.get(this.citiesUrl, { responseType: 'text' });
  }
}