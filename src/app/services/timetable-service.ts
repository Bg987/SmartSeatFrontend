import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  private baseUrl = 'http://localhost:8080/api/university';

  constructor(private http: HttpClient) {}

  generateTimetable(data: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/generateTimetable`, data,
      {withCredentials:true}
    );
  }
}
