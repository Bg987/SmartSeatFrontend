import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  private apiUrl = 'http://localhost:8080/api/university/addCollege';

  constructor(private http: HttpClient) {}

   addCollege(collegeData: any): Observable<any> {
    return this.http.post(this.apiUrl, collegeData, {
      responseType: 'text',      // backend String return kar raha hai
      withCredentials: true      //cookie/session send hogi
    });
  }
}
