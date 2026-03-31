import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetStudents {
  private url = environment.apiUrl;
    private apiUrl = `${ this.url }/colleges/students`;


  constructor(private http: HttpClient) { }

getStudents(): Observable<string> {
  return this.http.get(`${this.apiUrl}`, {
    withCredentials: true,
    responseType: 'text' // <--- This stops the "red" parsing error
  });
}


  }



