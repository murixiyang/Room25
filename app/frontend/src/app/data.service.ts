import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private backendUrl = 'http://localhost:8080/api/test';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    console.log('Here');
    return this.http.get<any>(this.backendUrl);
  }
}
