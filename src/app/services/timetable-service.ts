import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateTimetable(data: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/university/generateTimetable`, data,
      {withCredentials:true}
    );
  }
}
